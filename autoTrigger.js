/** 
 * intialize alreadyVisited {@type Set<string>} to track networks 
 * we gained access to and start {@link gainRootAccessOnAllNetworks()}
 * 
 * @param {NS} ns 
 */
export async function main(ns) {
  const { rm } = ns;

  let alreadyVisited = new Set();
  rm("neighbors.txt", 'home'); // remove previously created neighbors.txt

  gainRootAccessOnAllNetworks(alreadyVisited, ns);
}

/**
 * starts by copying scripts to the hacked server and begins evaluating server threads to use on hack scripts
 * @param {NS} ns - NetScript API functions
 */
export function startHackJobs(ns, server) {
  const hackJobScripts = ["smGrow.js", "smWeaken.js", "smHack.js"];

  for (const script of hackJobScripts) {
    ns.scp(script, server, 'home')
  }

  const growT = (Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam("smGrow.js")));

  if (growT === 0) {
    ns.exec("smGrow.js", server);
    return;
  }

  ns.exec("smGrow.js", server, growT, ...[growT]);
}

/**
 * create logs and neighbors.txt
 * 
 * @param {NS} ns - NetScript API
 * @param {string} server - the current server we will create logs for
 */
export function logging(ns, server) {
  const { hasRootAccess, getServerNumPortsRequired, tprintf, scan, write, } = ns;

  const neighbors = scan(server);
  const isAccessible = hasRootAccess(server);
  const portsReq = getServerNumPortsRequired(server);
  const log = `server: ${server} | root: ${isAccessible} | ports req: ${portsReq}`

  tprintf(log);
  write('neighbors.txt', `[${log}]: ${neighbors}\n`);
}

/**
 * Starts by scan and iterating all the networks nearby and begins to start gaining root access.
 * If we can hack the network then we will run {@link startHackJobs()} 
 * and when finished we will begin recursively scanning nearby networks to gain root access
 * 
 * @param {Set<string>} visited - the collection of servers we already visited
 * @param {NS} ns - NetScript API
 * @param {string} currentServer - the current server to start 
 */
export async function gainRootAccessOnAllNetworks(visited, ns, currentServer = 'home') {
  const { scan, hasRootAccess, getServerNumPortsRequired, getServer, nuke, ftpcrack, relaysmtp, brutessh, sqlinject, httpworm, ls } = ns;

  const hasBruteSSH = ls("home", "BruteSSH")[0] !== undefined
  const hasFTPCrack = ls("home", "FTPCrack")[0] !== undefined
  const hasSQLInject = ls("home", "SQLInject")[0] !== undefined
  const hasRelaySmtp = ls("home", "relaySMTP")[0] !== undefined
  const hasHTTPWorm = ls("home", "HTTPWorm")[0] !== undefined

  visited.add(currentServer);
  const neighbors = scan(currentServer); // Who's next door in server world?

  neighbors.forEach(async (neighbor) => {
    const { openPortCount, purchasedByPlayer, sshPortOpen, ftpPortOpen, sqlPortOpen, smtpPortOpen, httpPortOpen } = getServer(neighbor);

    logging(ns, neighbor);

    if (!visited.has(neighbor) && !purchasedByPlayer && neighbor !== 'home') {

      // attempt to crack server
      if (!hasRootAccess(neighbor)) {
        const portsReq = getServerNumPortsRequired(neighbor);

        if (portsReq >= 1) {
          if (!sshPortOpen && hasBruteSSH) {
            brutessh(neighbor);
          }

          if (!ftpPortOpen && hasFTPCrack) {
            ftpcrack(neighbor);
          }

          if (!sqlPortOpen && hasSQLInject) {
            sqlinject(neighbor);
          }

          if (!smtpPortOpen && hasRelaySmtp) {
            relaysmtp(neighbor);
          }

          if (!httpPortOpen && hasHTTPWorm) {
            httpworm(neighbor);
          }
        }

        if (openPortCount >= portsReq) {
          nuke(neighbor);
        }
      }

      if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(neighbor)) {
        startHackJobs(ns, neighbor);
      }

      await gainRootAccessOnAllNetworks(visited, ns, neighbor);
    }
  })
}