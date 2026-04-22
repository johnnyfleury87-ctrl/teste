import { getScene, themeOrder } from "./scenes.js";

function calculateAge(birthDate) {
  if (!birthDate) {
    return null;
  }

  const today = new Date();
  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

function formatBirthDate(birthDate) {
  if (!birthDate) {
    return "A renseigner";
  }

  const parsedDate = new Date(birthDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "A renseigner";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function createActionButton(action, handlers) {
  const isLink = action.type === "external";
  const element = document.createElement(isLink ? "a" : "button");
  const variant = action.variant ?? "secondary";

  element.className = `${isLink ? "action-link" : "action-button"} ${isLink ? `action-link--${variant}` : `action-button--${variant}`}`;
  element.textContent = action.label;

  if (isLink) {
    element.href = action.href;
    element.target = "_blank";
    element.rel = "noreferrer";
  } else {
    element.type = "button";
    element.addEventListener("click", () => handlers.onAction(action));
  }

  return element;
}

function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}

function createMetricCard(metric) {
  const item = document.createElement("article");
  item.className = "proof-metric";

  const value = document.createElement("strong");
  value.className = "proof-metric__value";
  value.textContent = metric.value;

  const label = document.createElement("span");
  label.className = "proof-metric__label";
  label.textContent = metric.label;

  item.append(value, label);
  return item;
}

export function createUI(elements) {
  const {
    appShell,
    eyebrow,
    title,
    subtitle,
    body,
    choices,
    controls,
    media,
    speechStatus,
    themeStrip,
  } = elements;
  const profileCardState = new Map();

  function clearContainers() {
    body.replaceChildren();
    choices.replaceChildren();
    controls.replaceChildren();
    media.replaceChildren();
    themeStrip.replaceChildren();
  }

  function renderThemeStrip(state, handlers) {
    const shouldRender = state.activeThemeId || state.currentSceneId === "menu";

    if (!shouldRender) {
      return;
    }

    themeOrder.forEach((sceneId) => {
      const scene = getScene(sceneId);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-pill";
      button.dataset.sceneId = sceneId;
      button.textContent = scene.label;
      button.setAttribute("aria-label", `Afficher le theme ${scene.label}`);

      if (sceneId === state.activeThemeId) {
        button.classList.add("is-active");
      }

      button.addEventListener("click", () => handlers.onThemeJump(sceneId));
      themeStrip.append(button);
    });
  }

  function renderMenuChoices(scene, state, handlers) {
    scene.choices.forEach((choiceId) => {
      const choiceScene = getScene(choiceId);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-card";
      button.dataset.sceneId = choiceId;

      if (choiceId === state.activeThemeId) {
        button.classList.add("is-selected");
      }

      const label = document.createElement("p");
      label.className = "kicker";
      label.textContent = choiceScene.label;

      const titleElement = document.createElement("h2");
      titleElement.className = "choice-card__title";
      titleElement.textContent = choiceScene.title;

      const description = document.createElement("p");
      description.className = "choice-card__text";
      description.textContent = choiceScene.subtitle;

      const cta = document.createElement("span");
      cta.className = "choice-card__cta";
      cta.textContent = "Ouvrir la scene";

      button.append(label, titleElement, description, cta);
      button.addEventListener("click", () => handlers.onChoiceSelect(choiceId));
      choices.append(button);
    });
  }

  function renderMedia(scene) {
    if (scene.profileCard) {
      const isExpanded = profileCardState.get(scene.id) ?? false;
      const card = document.createElement("article");
      card.className = "profile-card";

      if (isExpanded) {
        card.classList.add("is-open");
      }

      const header = document.createElement("div");
      header.className = "profile-card__header";

      const identity = document.createElement("div");
      identity.className = "profile-card__identity";

      const title = document.createElement("h2");
      title.className = "profile-card__title";
      title.textContent = scene.profileCard.name;

      const role = document.createElement("p");
      role.className = "profile-card__role";
      role.textContent = scene.profileCard.role;

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "profile-card__toggle";
      toggle.textContent = scene.profileCard.buttonLabel;
      toggle.setAttribute("aria-expanded", String(isExpanded));
      toggle.setAttribute("aria-controls", `profile-card-details-${scene.id}`);

      const details = document.createElement("div");
      details.className = "profile-card__details";
      details.id = `profile-card-details-${scene.id}`;
      details.classList.toggle("is-collapsed", !isExpanded);
      details.setAttribute("aria-hidden", String(!isExpanded));

      scene.profileCard.details.forEach((entry) => {
        details.append(createProfileCardRow(entry.label, entry.value));
      });

      const birthDateLabel = formatBirthDate(scene.profileCard.birthDate);
      const age = calculateAge(scene.profileCard.birthDate);
      details.append(createProfileCardRow("Date de naissance", birthDateLabel));
      details.append(createProfileCardRow("Age", age === null ? "Calcule automatiquement apres ajout" : `${age} ans`));

      toggle.addEventListener("click", () => {
        const nextState = !(profileCardState.get(scene.id) ?? false);
        profileCardState.set(scene.id, nextState);
        card.classList.toggle("is-open", nextState);
        toggle.setAttribute("aria-expanded", String(nextState));
        toggle.textContent = nextState ? "Masquer ▲" : scene.profileCard.buttonLabel;
        details.classList.toggle("is-collapsed", !nextState);
        details.setAttribute("aria-hidden", String(!nextState));
      });

      identity.append(title, role, toggle);
      header.append(identity);
      card.append(header, details);
      media.append(card);
    }

    if (scene.media?.type === "image") {
      const card = document.createElement("article");
      card.className = "media-card";

      const image = document.createElement("img");
      image.className = "media-card__image";
      image.src = scene.media.src;
      image.alt = scene.media.alt;

      const caption = document.createElement("p");
      caption.className = "media-card__caption";
      caption.textContent = scene.media.caption;

      card.append(image, caption);
      media.append(card);
    }

    if (scene.metrics?.length) {
      const grid = document.createElement("div");
      grid.className = "proof-grid";

      scene.metrics.forEach((metric) => grid.append(createMetricCard(metric)));
      media.append(grid);
    }
  }

  function createProfileCardRow(label, value) {
    const row = document.createElement("div");
    row.className = "profile-card__row";

    const rowLabel = document.createElement("span");
    rowLabel.className = "profile-card__label";
    rowLabel.textContent = label;

    const rowValue = document.createElement("span");
    rowValue.className = "profile-card__value";
    rowValue.textContent = value;

    row.append(rowLabel, rowValue);
    return row;
  }

  function renderControls(scene, state, handlers) {
    const controlActions = [];

    if (scene.id !== "menu") {
      if (scene.back === "menu") {
        controlActions.push({ type: "navigate", target: "menu", label: "Retour menu", variant: "ghost" });
      } else if (scene.back) {
        controlActions.push({ type: "navigate", target: scene.back, label: "Retour", variant: "secondary" });
        controlActions.push({ type: "navigate", target: "menu", label: "Menu principal", variant: "ghost" });
      } else {
        controlActions.push({ type: "navigate", target: "menu", label: "Retour menu", variant: "ghost" });
      }
    }

    if (scene.speechText) {
      controlActions.push({ type: "replay", label: "Rejouer audio", variant: "secondary" });
      controlActions.push({ type: "stop", label: "Arreter la voix", variant: "ghost" });
    }

    if (scene.next) {
      controlActions.push({ type: "navigate", target: scene.next, label: "Scene suivante", variant: "primary" });
    }

    if (scene.actions?.length) {
      controlActions.push(...scene.actions);
    }

    controlActions.forEach((action) => {
      if (action.type === "replay") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "action-button action-button--secondary";
        button.textContent = action.label;
        button.addEventListener("click", handlers.onReplay);
        controls.append(button);
        return;
      }

      if (action.type === "stop") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "action-button action-button--ghost";
        button.textContent = action.label;
        button.disabled = !state.isSpeaking;
        button.addEventListener("click", handlers.onStop);
        controls.append(button);
        return;
      }

      controls.append(createActionButton(action, handlers));
    });
  }

  function render(scene, state, handlers) {
    clearContainers();
    appShell.dataset.scene = scene.id;
    eyebrow.textContent = scene.label;
    title.textContent = scene.title;
    subtitle.textContent = scene.subtitle;

    scene.body.forEach((paragraph) => body.append(createParagraph(paragraph)));
    renderThemeStrip(state, handlers);

    if (scene.layout === "menu") {
      renderMenuChoices(scene, state, handlers);
    }

    renderMedia(scene);
    renderControls(scene, state, handlers);
  }

  function animateSceneChange(callback) {
    appShell.classList.add("is-transitioning");
    window.setTimeout(() => {
      callback();
      appShell.classList.remove("is-transitioning");
    }, 160);
  }

  function setSpeechStatus(message) {
    speechStatus.textContent = message;
  }

  return {
    render,
    animateSceneChange,
    setSpeechStatus,
  };
}