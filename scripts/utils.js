function promiseState(p) {
  const t = {};
  return Promise.race([p, t])
    .then(v => (v === t) ? "pending" : "fulfilled", () => "rejected");
}