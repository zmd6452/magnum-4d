function getFrequency(data) {
  const freq = {};

  data.forEach(draw => {
    draw.numbers.forEach(num => {
      for (let d of num) {
        freq[d] = (freq[d] || 0) + 1;
      }
    });
  });

  return freq;
}

function renderFrequency(freq) {
  const table = document.getElementById("freqTable");
  table.innerHTML = "<tr><th>Digit</th><th>Count</th></tr>";

  Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .forEach(([digit,count])=>{
      table.innerHTML += `<tr><td>${digit}</td><td>${count}</td></tr>`;
    });
}
