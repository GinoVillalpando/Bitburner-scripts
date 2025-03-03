/** @param {NS} ns */
export async function main(ns) {
    let script = ns.args[0];
    let host = ns.getHostname();
    const autoRunRam = ns.getScriptRam('autoRun.js', 'home');
    const serversMaxRam = ns.getServerMaxRam(host);
    const usedRam =  ns.getServerUsedRam(host);

    const ramEvalWithAutoRun = (serversMaxRam - usedRam) / ns.getScriptRam(script) - autoRunRam;
    const ramEval =  (serversMaxRam - usedRam) / ns.getScriptRam(script);

    let t = (Math.floor(host === 'home' ? ramEvalWithAutoRun : ramEval));
    ns.run(script, t, ...[t]);
}