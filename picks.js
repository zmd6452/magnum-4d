function containsRequiredDigits(number, digits) {
  return digits.every(d => number.includes(d.toString()));
}

function generatePicks(data) {
  const allNums = new Set();
  data.forEach(d => d.numbers.forEach(n => allNums.add(n)));

  const required = CONFIG.requiredDigits;
  return [...allNums]
    .filter(n => containsRequiredDigits(n, required))
    .slice(0, CONFIG.totalPicks);
}

function runAnalysis() {
  const input = document.getElementById("requiredDigits").value;
  CONFIG.requiredDigits = input.split(",").map(n => parseInt(n.trim()));

  const freq = calculateFrequency(DRAW_DATA);
  renderFrequency(freq);

  const picks = generatePicks(DRAW_DATA);
  const ul = document.getElementById("picks");
  ul.innerHTML = "";

  picks.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ul.appendChild(li);
  });
}
