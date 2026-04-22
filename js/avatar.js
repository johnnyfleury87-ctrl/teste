export function createAvatarController(elements) {
  const { card, voiceChip } = elements;

  const moiBtn = document.getElementById("avatar-moi-btn");
  const contactPanel = document.getElementById("avatar-contact-panel");
  const timeTravelBtn = document.getElementById("avatar-time-travel-btn");
  const timeTravelPanel = document.getElementById("avatar-time-travel-panel");
  const cinematicFlashback = document.getElementById("cinematic-flashback");
  const cinematicFlashbackLine = document.getElementById("cinematic-flashback-line");
  const retroJourney = document.getElementById("avatar-retro-journey");

  const revealTimers = [];
  let isSequencePlaying = false;

  function clearRevealTimers() {
    while (revealTimers.length) {
      window.clearTimeout(revealTimers.pop());
    }
  }

  function hideJourney() {
    if (!retroJourney) {
      return;
    }

    retroJourney.classList.remove("is-visible");
    retroJourney.setAttribute("aria-hidden", "true");
  }

  function showJourney() {
    if (!retroJourney) {
      return;
    }

    retroJourney.classList.add("is-visible");
    retroJourney.setAttribute("aria-hidden", "false");
  }

  function hideCinematicFlashback() {
    if (!cinematicFlashback) {
      return;
    }

    cinematicFlashback.classList.add("is-hidden");
    cinematicFlashback.classList.remove("is-active", "is-fading-out");
    cinematicFlashback.setAttribute("aria-hidden", "true");

    if (cinematicFlashbackLine) {
      cinematicFlashbackLine.classList.remove("is-visible");
    }
  }

  function resetNarrativePanel() {
    if (!timeTravelBtn || !timeTravelPanel) {
      return;
    }

    clearRevealTimers();
    isSequencePlaying = false;
    timeTravelBtn.disabled = false;
    timeTravelBtn.setAttribute("aria-expanded", "false");
    timeTravelBtn.textContent = "On remonte le temps ?";
    timeTravelPanel.classList.add("is-collapsed");
    timeTravelPanel.classList.remove("is-open", "is-cinematic");
    timeTravelPanel.setAttribute("aria-hidden", "true");
    hideCinematicFlashback();
    hideJourney();
  }

  function playNarrativeSequence() {
    if (!timeTravelBtn || !timeTravelPanel || !cinematicFlashback) {
      return;
    }

    clearRevealTimers();
    isSequencePlaying = true;
    timeTravelBtn.disabled = true;
    timeTravelBtn.setAttribute("aria-expanded", "true");
    timeTravelBtn.textContent = "Lecture en cours...";
    timeTravelPanel.classList.remove("is-collapsed");
    timeTravelPanel.classList.add("is-open", "is-cinematic");
    timeTravelPanel.setAttribute("aria-hidden", "false");
    hideJourney();

    cinematicFlashback.classList.remove("is-hidden", "is-fading-out");
    cinematicFlashback.classList.add("is-active");
    cinematicFlashback.setAttribute("aria-hidden", "false");

    if (cinematicFlashbackLine) {
      cinematicFlashbackLine.classList.remove("is-visible");
    }

    if (cinematicFlashbackLine) {
      revealTimers.push(
        window.setTimeout(() => {
          cinematicFlashbackLine.classList.add("is-visible");
        }, 760),
      );
    }

    revealTimers.push(
      window.setTimeout(() => {
        cinematicFlashback.classList.add("is-fading-out");
      }, 1520),
    );

    revealTimers.push(
      window.setTimeout(() => {
        hideCinematicFlashback();
        timeTravelPanel.classList.remove("is-cinematic");
        showJourney();
        isSequencePlaying = false;
        timeTravelBtn.disabled = false;
        timeTravelBtn.textContent = "Masquer le parcours";
      }, 1940),
    );
  }

  if (moiBtn && contactPanel) {
    moiBtn.addEventListener("click", () => {
      const isOpen = moiBtn.getAttribute("aria-expanded") === "true";
      const nextState = !isOpen;

      moiBtn.setAttribute("aria-expanded", String(nextState));
      moiBtn.textContent = nextState ? "Fermer ✕" : "Moi ?";
      contactPanel.classList.toggle("is-collapsed", !nextState);
      contactPanel.setAttribute("aria-hidden", String(!nextState));

      if (!nextState) {
        resetNarrativePanel();
      }
    });
  }

  if (timeTravelBtn && timeTravelPanel) {
    timeTravelBtn.addEventListener("click", () => {
      if (isSequencePlaying) {
        return;
      }

      const isOpen = timeTravelBtn.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        resetNarrativePanel();
        return;
      }

      playNarrativeSequence();
    });
  }

  function update(scene, { isSpeaking, voiceSupported }) {
    card.dataset.speaking = String(isSpeaking);
    voiceChip.textContent = isSpeaking
      ? "En train de parler"
      : voiceSupported
        ? "Voix en attente"
        : "Voix indisponible";
  }

  return {
    update,
  };
}