/** @param {NS} ns */
export async function main(ns, args) {
  const { formulas, getPlayer, getServer } = ns;
  const { hacking } = formulas;
  const server = getServer(args);

  hacking.hackChance(server, getPlayer());
}