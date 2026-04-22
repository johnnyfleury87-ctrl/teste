const state = {
  currentSceneId: "intro",
  activeThemeId: null,
  isSpeaking: false,
  speechSupported: typeof window !== "undefined" && "speechSynthesis" in window,
  voiceReady: false,
  lastSpeechText: "",
  transitionLockedUntil: 0,
};

export function getState() {
  return { ...state };
}

export function canNavigate() {
  return Date.now() >= state.transitionLockedUntil;
}

export function lockNavigation(duration = 280) {
  state.transitionLockedUntil = Date.now() + duration;
}

export function setScene(sceneId) {
  state.currentSceneId = sceneId;
}

export function setActiveTheme(themeId) {
  state.activeThemeId = themeId;
}

export function setSpeaking(isSpeaking) {
  state.isSpeaking = isSpeaking;
}

export function setSpeechSupported(isSupported) {
  state.speechSupported = isSupported;
}

export function setVoiceReady(isReady) {
  state.voiceReady = isReady;
}

export function setLastSpeechText(text) {
  state.lastSpeechText = text;
}