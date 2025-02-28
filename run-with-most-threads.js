/** @param {NS} ns */
export async function main(ns) {
    let script = ns.args[0];
    let host = ns.getHostname();
    let t = (Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script)));
    ns.run(script, t, ...[t]);
}