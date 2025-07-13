const formatInstructions = (text) => {
  if (typeof text !== 'string') return ['No instructions available.'];
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => `${s}.`);
};

export default formatInstructions;
