function mustContainDigits(num, mustDigits) {
  return mustDigits.every(d => num.includes(d));
}
