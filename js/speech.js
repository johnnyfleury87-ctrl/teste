let synth = null;
let currentUtterance = null;
let voices = [];
let onStateChange = () => {};
let onAvailabilityChange = () => {};

const masculineHints = [
  "male",
  "masculin",
  "homme",
  "thomas",
  "alex",
  "nicolas",
  "antoine",
  "paul",
  "yann",
  "gabriel",
  "daniel",
  "julien",
  "pierre",
  "jean",
  "luca",
  "reed",
  "grandpa",
  "brice",
];

const naturalHints = ["natural", "premium", "enhanced", "neural", "google", "microsoft"];

function refreshVoices() {
  if (!synth) {
    voices = [];
    return voices;
  }

  voices = synth.getVoices();
  onAvailabilityChange({
    supported: true,
    voiceReady: voices.length > 0,
  });

  return voices;
}

function getPreferredVoice() {
  if (!voices.length) {
    refreshVoices();
  }

  const frenchVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("fr"));

  if (!frenchVoices.length) {
    return null;
  }

  const rankedVoices = frenchVoices
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .sort((left, right) => right.score - left.score);

  return rankedVoices[0]?.voice ?? frenchVoices[0] ?? null;
}

function scoreVoice(voice) {
  const name = voice.name?.toLowerCase() ?? "";
  const lang = voice.lang?.toLowerCase() ?? "";

  let score = 0;

  if (lang.startsWith("fr-fr")) {
    score += 6;
  } else if (lang.startsWith("fr")) {
    score += 4;
  }

  if (voice.localService) {
    score += 2;
  }

  if (masculineHints.some((hint) => name.includes(hint))) {
    score += 8;
  }

  if (naturalHints.some((hint) => name.includes(hint))) {
    score += 3;
  }

  const feminineHints = ["female", "femme", "amelie", "amélie", "marie", "alice", "lea", "léa", "claire", "elsa", "audrey", "isabelle", "juliette"];
  if (feminineHints.some((hint) => name.includes(hint))) {
    score -= 20;
  }

  return score;
}

export function initSpeech({ handleStateChange, handleAvailabilityChange }) {
  onStateChange = handleStateChange;
  onAvailabilityChange = handleAvailabilityChange;

  if (!("speechSynthesis" in window)) {
    onAvailabilityChange({ supported: false, voiceReady: false });
    return;
  }

  synth = window.speechSynthesis;
  refreshVoices();

  if (typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", refreshVoices);
  } else {
    synth.onvoiceschanged = refreshVoices;
  }
}

export function speakText(text) {
  if (!synth || !text) {
    return false;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getPreferredVoice();

  utterance.lang = voice?.lang ?? "fr-FR";
  utterance.voice = voice;
  utterance.rate = 0.98;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => {
    onStateChange({ speaking: true, error: null });
  };

  utterance.onend = () => {
    currentUtterance = null;
    onStateChange({ speaking: false, error: null });
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onStateChange({
      speaking: false,
      error: "Lecture vocale indisponible pour cette scene.",
    });
  };

  currentUtterance = utterance;
  synth.speak(utterance);
  return true;
}

export function stopSpeech() {
  if (!synth) {
    return;
  }

  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  currentUtterance = null;
  onStateChange({ speaking: false, error: null });
}

export function replayText(text) {
  return speakText(text);
}