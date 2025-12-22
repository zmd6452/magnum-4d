let RESULTS = [];

fetch("data/results.csv")
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").slice(1);
    RESULTS = rows.map(r => r.split(",")[2]);
    buildFrequency();
  });
