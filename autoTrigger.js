/** @param {NS} ns */
export async function main(ns) {
  const { rm } = ns;

  let alreadyVisited = new Set();
  rm("neighbors.txt", 'home');

  recursiveNeighbors('home', alreadyVisited, ns);
}

export function serverCpExe(ns, n) {
  ["smGrow.js", "smWeaken.js", "smHack.js"].forEach(async (script) => {
    ns.scp(script, n, 'home');
  })

  ns.exec("smGrow.js", n);
}

export function logging(ns, neighbor) {
  const { hasRootAccess, getServerNumPortsRequired, tprintf, print, scan, write, } = ns;
  const moreNeighbors = scan(neighbor);
  const isAccessible = hasRootAccess(neighbor);
  const portsReq = getServerNumPortsRequired(neighbor);
  const log = `server: ${neighbor} | root: ${isAccessible} | ports req: ${portsReq}`

  tprintf(log);
  print(log);
  write('neighbors.txt', `neighbors for ${neighbor}: ${moreNeighbors}\n`);
}

export async function recursiveNeighbors(currentServer, visited, ns) {
  const { scan, hasRootAccess, getServerNumPortsRequired, getServer, nuke, ftpcrack, relaysmtp, brutessh, sqlinject, httpworm, rm } = ns;

  if (currentServer !== 'home') {
    rm('smGrow.js', currentServer);
    rm('smWeaken.js', currentServer);
    rm('smHack.js', currentServer);
  }


  visited.add(currentServer);
  const neighbors = scan(currentServer); // Who's next door in server world?

  neighbors.forEach(async (neighbor) => {
    const { openPortCount, purchasedByPlayer } = getServer(neighbor);

    if (neighbor !== 'home') {
      rm('smGrow.js', currentServer);
      rm('smWeaken.js', currentServer);
      rm('smHack.js', currentServer);
    }


    if (!visited.has(neighbor) && !purchasedByPlayer && neighbor !== 'home' && neighbor !== 'I.I.I.I') {

      // logging
      logging(ns, neighbor);

      // attempt to crack server
      if (!hasRootAccess(neighbor)) {
        const portOpeners = [brutessh, ftpcrack, sqlinject, httpworm, relaysmtp];
        const portsReq = getServerNumPortsRequired(neighbor);


        if (portsReq >= 1) {
          portOpeners.forEach(portOpener => {
            portOpener(neighbor)
          })
        }

        if (openPortCount >= portsReq) {
          nuke(neighbor);
        }
      }

      serverCpExe(ns, neighbor);
      await recursiveNeighbors(neighbor, visited, ns);
    }
  })
}