import { createAvatarController } from "./avatar.js";
import { createAutoplayController } from "./autoplay.js";
import { getScene, themeOrder } from "./scenes.js";
import {
  canNavigate,
  getState,
  lockNavigation,
  setActiveTheme,
  setLastSpeechText,
  setScene,
  setSpeaking,
  setSpeechSupported,
  setVoiceReady,
} from "./state.js";
import { initSpeech, replayText, speakText, stopSpeech } from "./speech.js";
import { createUI } from "./ui.js";

const elements = {
  appShell: document.querySelector("#app-shell"),
  visualStage: document.querySelector(".visual-stage"),
  avatarCard: document.querySelector("#avatar-card"),
  eyebrow: document.querySelector("#scene-eyebrow"),
  title: document.querySelector("#scene-title"),
  subtitle: document.querySelector("#scene-subtitle"),
  body: document.querySelector("#scene-body"),
  choices: document.querySelector("#scene-choices"),
  controls: document.querySelector("#scene-controls"),
  media: document.querySelector("#scene-media"),
  speechStatus: document.querySelector("#speech-status"),
  themeStrip: document.querySelector("#theme-strip"),
  autoplayPanel: document.querySelector("#autoplay-panel"),
  autoplayProgress: document.querySelector("#autoplay-progress"),
  autoplayProgressFill: document.querySelector("#autoplay-progress-fill"),
  autoplayStep: document.querySelector("#autoplay-step"),
  autoplayMessage: document.querySelector("#autoplay-message"),
  autoplayStop: document.querySelector("#autoplay-stop"),
  finalCTAZone: document.querySelector("#final-cta-zone"),
  finalCTAButton: document.querySelector("#final-cta-button"),
  finalContactCard: document.querySelector("#final-contact-card"),
};

const sceneVisualById = {
  intro: "image/Capture d'écran 2026-04-21 141151.png",
  menu: "image/Capture d'écran 2026-04-21 141151.png",
  whoAmI: "image/quijesuis.png",
  strength: "image/maforce.png",
  evolution: "image/evolution.png",
  projects: "image/projets.png",
  vision: "image/mavision.png",
  difference: "image/cequimediff.png",
  conclusion: "image/Capture d'écran 2026-04-21 141151.png",
};

let activeVisualImage = "";
let autoplayMode = "manual";
let isFinalContactRevealed = false;

const avatar = createAvatarController({
  card: document.querySelector("#avatar-card"),
  voiceChip: document.querySelector("#avatar-voice-chip"),
});

const ui = createUI(elements);

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function resolveVisualImage(sceneId) {
  return sceneVisualById[sceneId] ?? sceneVisualById.intro;
}

function applyVisualImage(sceneId) {
  if (!elements.visualStage) {
    return;
  }

  const imagePath = resolveVisualImage(sceneId);

  if (imagePath === activeVisualImage) {
    return;
  }

  activeVisualImage = imagePath;
  elements.visualStage.style.setProperty("--scene-visual-image", `url("${imagePath}")`);
}

async function animateSceneImageChange(nextSceneId) {
  if (!elements.visualStage) {
    return;
  }

  const imagePath = resolveVisualImage(nextSceneId);

  if (imagePath === activeVisualImage) {
    return;
  }

  elements.visualStage.classList.remove("is-visual-enter");
  elements.visualStage.classList.add("is-visual-exit");
  await wait(220);

  activeVisualImage = imagePath;
  elements.visualStage.style.setProperty("--scene-visual-image", `url("${imagePath}")`);

  elements.visualStage.classList.remove("is-visual-exit");
  elements.visualStage.classList.add("is-visual-enter");
  await wait(340);
  elements.visualStage.classList.remove("is-visual-enter");
}

function highlightNextButton(nextSceneId) {
  const nextButton = elements.themeStrip?.querySelector(`[data-scene-id="${nextSceneId}"]`);

  if (!nextButton) {
    return Promise.resolve();
  }

  nextButton.classList.remove("next-scene-highlight");
  nextButton.offsetHeight;
  nextButton.classList.add("next-scene-highlight");

  return wait(760).then(() => {
    nextButton.classList.remove("next-scene-highlight");
  });
}

async function prepareAutoplayTransition({ nextSceneId }) {
  await wait(420);
  await Promise.all([highlightNextButton(nextSceneId), animateSceneImageChange(nextSceneId)]);
  await wait(180);
}

function updateAutoplayUI(status) {
  if (!elements.autoplayPanel || !elements.autoplayProgressFill || !elements.autoplayProgress) {
    return;
  }

  const shouldDisplay = status.mode !== "manual";
  elements.autoplayPanel.classList.toggle("is-hidden", !shouldDisplay);
  elements.autoplayPanel.dataset.mode = status.mode;
  elements.appShell.classList.toggle("is-autoplay-running", status.mode === "running");

  const progress = Math.max(0, Math.min(100, status.progress ?? 0));
  elements.autoplayProgressFill.style.width = `${progress}%`;
  elements.autoplayProgress.setAttribute("aria-valuenow", String(progress));

  if (elements.autoplayStep) {
    if (status.mode === "running") {
      elements.autoplayStep.textContent = `Etape ${status.currentIndex + 1} sur ${status.total}`;
    } else if (status.mode === "completed") {
      elements.autoplayStep.textContent = "Parcours termine";
    } else if (status.mode === "stopped") {
      elements.autoplayStep.textContent = "Lecture interrompue";
    }
  }

  if (elements.autoplayMessage) {
    elements.autoplayMessage.textContent = status.message ?? "";
  }

  if (elements.autoplayStop) {
    elements.autoplayStop.classList.toggle("is-hidden", status.mode !== "running");
  }

  autoplayMode = status.mode ?? "manual";
  updateFinalCTAVisibility(getState().currentSceneId);
}

function updateFinalCTAVisibility(sceneId) {
  if (!elements.finalCTAZone || !elements.finalCTAButton || !elements.finalContactCard) {
    return;
  }

  const shouldShowCTA = autoplayMode === "completed" || sceneId === "conclusion";

  elements.finalCTAZone.classList.toggle("is-visible", shouldShowCTA);
  elements.finalCTAZone.setAttribute("aria-hidden", String(!shouldShowCTA));

  if (!shouldShowCTA) {
    return;
  }

  elements.finalCTAButton.classList.toggle("cta-animate", !isFinalContactRevealed);
  elements.finalCTAButton.textContent = isFinalContactRevealed ? "Contact affiché" : "On y va ?";
  elements.finalCTAButton.setAttribute("aria-expanded", String(isFinalContactRevealed));

  elements.finalContactCard.classList.toggle("is-visible", isFinalContactRevealed);
  elements.finalContactCard.setAttribute("aria-hidden", String(!isFinalContactRevealed));
}

function handleFinalCTAClick() {
  if (!elements.finalCTAButton || !elements.finalContactCard) {
    return;
  }

  isFinalContactRevealed = true;
  elements.finalCTAButton.classList.remove("cta-animate");
  elements.finalCTAButton.textContent = "Contact affiché";
  elements.finalCTAButton.setAttribute("aria-expanded", "true");

  elements.finalContactCard.classList.add("is-visible");
  elements.finalContactCard.setAttribute("aria-hidden", "false");
}

const autoplay = createAutoplayController({
  sequence: themeOrder,
  navigateToScene(sceneId) {
    navigateTo(sceneId, {
      force: true,
      speak: true,
      activeThemeId: sceneId,
    });
  },
  getSceneById(sceneId) {
    return getScene(sceneId);
  },
  getSpeechState() {
    const state = getState();
    return {
      isSpeaking: state.isSpeaking,
      speechSupported: state.speechSupported,
      voiceReady: state.voiceReady,
    };
  },
  stopSpeech,
  prepareNextChapter: prepareAutoplayTransition,
  onStatusChange: updateAutoplayUI,
});

function resolveSpeechStatus(scene) {
  const state = getState();

  if (!state.speechSupported) {
    return "Synthèse vocale non disponible sur ce navigateur. Le contenu reste intégral et lisible.";
  }

  if (!state.voiceReady) {
    return "Voix navigateur en cours de chargement. La lecture reste disponible dès qu'une voix est prête.";
  }

  if (state.isSpeaking) {
    return `Lecture en cours : ${scene.label}.`;
  }

  if (scene.speechText) {
    return "Vous pouvez écouter cette scène, relancer la lecture ou poursuivre vers la suite.";
  }

  return "La scène d'accueil reste volontairement silencieuse pour laisser l'utilisateur déclencher l'expérience.";
}

function syncAvatar(scene) {
  const state = getState();
  avatar.update(scene, {
    isSpeaking: state.isSpeaking,
    voiceSupported: state.speechSupported,
  });

  if (elements.avatarCard) {
    const shouldShowAvatarCard = scene.id === "intro";
    elements.avatarCard.classList.toggle("is-scene-hidden", !shouldShowAvatarCard);
    elements.avatarCard.setAttribute("aria-hidden", String(!shouldShowAvatarCard));
  }
}

function renderCurrentScene() {
  const state = getState();
  const scene = getScene(state.currentSceneId);
  applyVisualImage(scene.id);

  ui.render(scene, state, {
    onAction: handleAction,
    onChoiceSelect: handleChoiceSelect,
    onReplay: handleReplay,
    onStop: handleStop,
    onThemeJump: handleThemeJump,
  });

  ui.setSpeechStatus(resolveSpeechStatus(scene));
  syncAvatar(scene);
  updateFinalCTAVisibility(scene.id);
}

function navigateTo(sceneId, options = {}) {
  const { force = false, speak = false, activeThemeId = null } = options;

  if (!force && !canNavigate()) {
    return;
  }

  const targetScene = getScene(sceneId);

  lockNavigation();
  stopSpeech();
  setScene(targetScene.id);
  setActiveTheme(activeThemeId);

  ui.animateSceneChange(() => {
    renderCurrentScene();

    if (speak && targetScene.speechText) {
      setLastSpeechText(targetScene.speechText);
      const didSpeak = speakText(targetScene.speechText);

      if (!didSpeak) {
        ui.setSpeechStatus("Lecture vocale indisponible. Le texte reste consultable à l'écran.");
      }
    }
  });
}

function handleChoiceSelect(sceneId) {
  if (autoplay.isRunning()) {
    return;
  }

  navigateTo(sceneId, {
    speak: true,
    activeThemeId: sceneId,
  });
}

function handleThemeJump(sceneId) {
  if (autoplay.isRunning()) {
    return;
  }

  navigateTo(sceneId, {
    speak: true,
    activeThemeId: sceneId,
  });
}

function handleAction(action) {
  if (autoplay.isRunning()) {
    return;
  }

  if (action.type === "navigate") {
    const state = getState();

    if (state.currentSceneId === "intro" && action.target === "menu") {
      autoplay.start();
      return;
    }

    const activeThemeId = action.target === "menu" ? state.activeThemeId : state.activeThemeId;

    navigateTo(action.target, {
      speak: action.target !== "intro",
      activeThemeId: action.target === "menu" ? activeThemeId : activeThemeId,
    });
  }
}

function handleReplay() {
  const state = getState();
  const scene = getScene(state.currentSceneId);
  const text = state.lastSpeechText || scene.speechText;

  if (!text) {
    return;
  }

  setLastSpeechText(text);
  replayText(text);
}

function handleStop() {
  if (autoplay.isRunning()) {
    autoplay.stop();
    return;
  }

  stopSpeech();
  renderCurrentScene();
}

elements.autoplayStop?.addEventListener("click", () => {
  autoplay.stop();
});

elements.finalCTAButton?.addEventListener("click", handleFinalCTAClick);

initSpeech({
  handleStateChange({ speaking, error }) {
    setSpeaking(speaking);
    autoplay.handleSpeechStateChange(speaking);
    renderCurrentScene();

    if (error) {
      ui.setSpeechStatus(error);
    }
  },
  handleAvailabilityChange({ supported, voiceReady }) {
    setSpeechSupported(supported);
    setVoiceReady(voiceReady);
    renderCurrentScene();
  },
});

renderCurrentScene();