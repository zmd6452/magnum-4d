function calculateFrequency(draws) {
  const freq = {};

  draws.forEach(d => {
    d.nums.forEach(n => {
      freq[n] = (freq[n] || 0) + 1;
    });
  });

  return freq;
}

function renderFrequency(freq) {
  const table = document.getElementById("freqTable");
  table.innerHTML = "<tr><th>Number</th><th>Count</th></tr>";

  Object.entries(freq)
    .sort((a,b) => b[1] - a[1])
    .forEach(([num, count]) => {
      const row = table.insertRow();
      row.innerHTML = `<td>${num}</td><td>${count}</td>`;
    });
}
