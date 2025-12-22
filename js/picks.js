function generatePicks() {
  const must = document.getElementById("mustDigits").value.split(",").filter(Boolean);
  const exclude = document.getElementById("excludeDigits").value.split(",").filter(Boolean);

  const picks = new Set();

  while (picks.size < 4) {
    let num = "";
    while (num.length < 4) {
      const d = Math.floor(Math.random() * 10).toString();
      if (!exclude.includes(d)) num += d;
    }

    if (must.every(d => num.includes(d))) {
      picks.add(num);
    }
  }

  const ul = document.getElementById("picks");
  ul.innerHTML = "";
  [...picks].forEach(p => ul.innerHTML += `<li>${p}</li>`);
}
