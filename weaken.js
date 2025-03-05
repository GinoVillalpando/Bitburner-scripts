/** @param {NS} ns */
export async function main(ns) {
  const threads = ns.args[0]

  while (true) {
    await ns.share();
    await ns.weaken('joesguns', { threads, stock: true })
  }
}