function calculateFrequency(data) {
  const freq = {};

  data.forEach(draw => {
    draw.numbers.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
    });
  });

  return Object.entries(freq)
    .sort((a,b) => b[1] - a[1])
    .slice(0, CONFIG.maxFrequencyResults);
}

function renderFrequency(freq) {
  const table = document.getElementById("freqTable");
  table.innerHTML = "<tr><th>Number</th><th>Count</th></tr>";

  freq.forEach(([num, count]) => {
    const row = table.insertRow();
    row.innerHTML = `<td>${num}</td><td>${count}</td>`;
  });
}
