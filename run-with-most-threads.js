/** @param {NS} ns */
export async function main(ns) {
    let script = ns.args[0];
    let host = ns.getHostname();
    const autoRunRam = ns.getScriptRam('autoRun.js');
    const serversMaxRam = ns.getServerMaxRam(host);
    const usedRam =  ns.getServerUsedRam(host);

    let t = (Math.floor((serversMaxRam - usedRam) / ns.getScriptRam(script) - autoRunRam));
    ns.run(script, t, ...[t]);
}