function runPrediction() {
  const input = document.getElementById("mustDigits").value;
  CONFIG.mustIncludeDigits = input.split(",").map(d=>d.trim());

  const freq = getFrequency(DRAW_DATA);
  renderFrequency(freq);

  const candidates = generateCandidates();
  const picks = candidates.slice(0, CONFIG.totalPicks);

  const ul = document.getElementById("picks");
  ul.innerHTML = "";
  picks.forEach(p => ul.innerHTML += `<li>${p}</li>`);
}

function generateCandidates() {
  const results = [];

  for (let i = 0; i < CONFIG.maxCandidates; i++) {
    let num = "";

    while (num.length < 4) {
      num += Math.floor(Math.random() * 10);
    }

    if (!passesRules(num)) continue;

    results.push(num);
  }

  return [...new Set(results)];
}

function passesRules(num) {
  // Must include chosen digits
  for (let d of CONFIG.mustIncludeDigits) {
    if (!num.includes(d)) return false;
  }
  return true;
}
