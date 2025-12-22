function buildFrequency() {
  const freq = {};
  RESULTS.forEach(num => {
    num.split("").forEach(d => {
      freq[d] = (freq[d] || 0) + 1;
    });
  });

  const table = document.getElementById("freqTable");
  table.innerHTML = "<tr><th>Digit</th><th>Count</th></tr>";
  Object.keys(freq).sort().forEach(d => {
    table.innerHTML += `<tr><td>${d}</td><td>${freq[d]}</td></tr>`;
  });
}
