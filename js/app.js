function runAnalysis() {
  const requiredDigits =
    document.getElementById("requiredDigits").value;

  const freq = calculateFrequency(draws);
  renderFrequency(freq);

  const picks = generatePicks(freq, requiredDigits);
  const ul = document.getElementById("picks");
  ul.innerHTML = "";

  picks.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ul.appendChild(li);
  });
}

// Auto run on load
runAnalysis();
