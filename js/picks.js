function generatePicks(freq, requiredDigits) {
  const req = requiredDigits.split(",").map(d => d.trim());
  const candidates = [];

  Object.keys(freq).forEach(num => {
    if (req.every(d => num.includes(d))) {
      candidates.push({ num, score: freq[num] });
    }
  });

  return candidates
    .sort((a,b) => b.score - a.score)
    .slice(0, 4)
    .map(x => x.num);
}
