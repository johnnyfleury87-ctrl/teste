export function createAutoplayController(options) {
  const {
    sequence,
    navigateToScene,
    getSceneById,
    getSpeechState,
    stopSpeech,
    prepareNextChapter,
    onStatusChange,
  } = options;

  const timers = [];
  let mode = "manual";
  let currentIndex = -1;
  let activeToken = 0;
  let speechSeen = false;
  let previousSpeaking = false;
  let ignoreSpeechUntil = 0;
  let transitionInProgress = false;
  const autoplayState = {
    isAutoplayRunning: false,
    isAutoplayStopped: false,
    currentChapterIndex: -1,
  };

  function clearTimers() {
    while (timers.length) {
      window.clearTimeout(timers.pop());
    }
  }

  function getProgress() {
    if (mode === "completed") {
      return 100;
    }

    if (currentIndex < 0) {
      return 0;
    }

    const completedSteps = Math.min(currentIndex + 1, sequence.length);
    return Math.round((completedSteps / sequence.length) * 100);
  }

  function emitStatus(message = "") {
    autoplayState.currentChapterIndex = currentIndex;
    onStatusChange({
      mode,
      currentIndex,
      total: sequence.length,
      progress: getProgress(),
      message,
      isAutoplayRunning: autoplayState.isAutoplayRunning,
      isAutoplayStopped: autoplayState.isAutoplayStopped,
    });
  }

  function estimateFallbackDuration(scene) {
    const text = [scene.speechText || "", ...(scene.body ?? [])].join(" ").trim();
    const words = text ? text.split(/\s+/).length : 22;
    return Math.min(20000, Math.max(4200, words * 360));
  }

  function advanceWhenSpeechIsDone(token, attempt = 0) {
    if (mode !== "running" || token !== activeToken) {
      return;
    }

    const speechState = getSpeechState();

    if (speechState.isSpeaking && attempt < 120) {
      timers.push(
        window.setTimeout(() => {
          advanceWhenSpeechIsDone(token, attempt + 1);
        }, 350),
      );
      return;
    }

    advanceIfCurrent(token);
  }

  function advanceIfCurrent(token) {
    if (mode !== "running" || token !== activeToken) {
      return;
    }

    if (currentIndex < 0) {
      goToNextScene();
      return;
    }

    transitionToNextScene(token);
  }

  async function transitionToNextScene(token) {
    if (mode !== "running" || token !== activeToken || transitionInProgress) {
      return;
    }

    const nextSceneId = sequence[currentIndex + 1] ?? null;

    if (!nextSceneId) {
      goToNextScene();
      return;
    }

    transitionInProgress = true;

    try {
      if (typeof prepareNextChapter === "function") {
        await prepareNextChapter({
          currentSceneId: sequence[currentIndex],
          nextSceneId,
          currentChapterIndex: currentIndex,
        });
      } else {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 380);
        });
      }
    } finally {
      transitionInProgress = false;
    }

    if (mode !== "running" || token !== activeToken) {
      return;
    }

    goToNextScene();
  }

  function scheduleSceneTransition(scene, token) {
    const speechState = getSpeechState();
    const speechIsExpected = speechState.speechSupported && speechState.voiceReady && Boolean(scene.speechText);
    const fallbackDuration = estimateFallbackDuration(scene);
    const fallbackMs = speechIsExpected ? Math.max(4600, fallbackDuration + 1200) : fallbackDuration;

    timers.push(
      window.setTimeout(() => {
        advanceWhenSpeechIsDone(token);
      }, fallbackMs),
    );

    if (speechIsExpected) {
      timers.push(
        window.setTimeout(() => {
          if (!speechSeen) {
            advanceWhenSpeechIsDone(token);
          }
        }, 4200),
      );
    }
  }

  function openScene(sceneId) {
    activeToken += 1;
    speechSeen = false;
    ignoreSpeechUntil = Date.now() + 520;

    navigateToScene(sceneId);

    const scene = getSceneById(sceneId);
    const token = activeToken;
    timers.push(
      window.setTimeout(() => {
        scheduleSceneTransition(scene, token);
      }, 680),
    );
  }

  function finishAutoplay() {
    mode = "completed";
    autoplayState.isAutoplayRunning = false;
    autoplayState.isAutoplayStopped = false;
    clearTimers();
    emitStatus("Presentation terminee, vous pouvez naviguer librement.");
  }

  function goToNextScene() {
    currentIndex += 1;

    if (currentIndex >= sequence.length) {
      finishAutoplay();
      return;
    }

    const sceneId = sequence[currentIndex];
    openScene(sceneId);
    emitStatus(`Etape ${currentIndex + 1} sur ${sequence.length}`);
  }

  function start() {
    if (mode === "running") {
      return;
    }

    clearTimers();
    activeToken += 1;
    mode = "running";
    autoplayState.isAutoplayRunning = true;
    autoplayState.isAutoplayStopped = false;
    currentIndex = -1;
    previousSpeaking = false;
    emitStatus("Lecture automatique en cours.");
    goToNextScene();
  }

  function stop() {
    if (mode !== "running") {
      return;
    }

    clearTimers();
    activeToken += 1;
    transitionInProgress = false;
    stopSpeech();
    mode = "stopped";
    autoplayState.isAutoplayRunning = false;
    autoplayState.isAutoplayStopped = true;
    emitStatus("Lecture interrompue, navigation manuelle active.");
  }

  function handleSpeechStateChange(speaking) {
    if (Date.now() < ignoreSpeechUntil) {
      if (speaking) {
        speechSeen = true;
      }
      previousSpeaking = speaking;
      return;
    }

    if (mode !== "running") {
      previousSpeaking = speaking;
      return;
    }

    if (speaking) {
      speechSeen = true;
    }

    if (previousSpeaking && !speaking && speechSeen) {
      const token = activeToken;
      clearTimers();
      timers.push(
        window.setTimeout(() => {
          advanceIfCurrent(token);
        }, 220),
      );
    }

    previousSpeaking = speaking;
  }

  function isRunning() {
    return mode === "running";
  }

  return {
    start,
    stop,
    isRunning,
    handleSpeechStateChange,
  };
}
