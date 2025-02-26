/** @param {NS} ns */
export async function main(ns) {
  ns.tail(ns.args[0]);
  ns.resizeTail(900, 100, ns.args[0]);
  ns.moveTail(Math.random() * (1000 - 1) + 1, Math.random() * (255 - 1) + 1, ns.args[0]);
  ns.exec("background.js", 'home')
}