function analyze(data, mustDigits) {
  const results = [];

  for (let i = 0; i < 10000; i++) {
    const num = i.toString().padStart(4, "0");

    if (!mustContainDigits(num, mustDigits)) continue;

    results.push(num);
    if (results.length >= 10) break;
  }

  return results;
}
