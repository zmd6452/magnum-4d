function runAnalysis() {
  const input = document.getElementById("mustDigits").value;
  const mustDigits = input.split(",").map(d => d.trim());

  const picks = analyze(drawData, mustDigits);

  const ul = document.getElementById("results");
  ul.innerHTML = "";

  picks.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    ul.appendChild(li);
  });
}
