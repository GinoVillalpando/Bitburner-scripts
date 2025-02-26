/** 
 * Continous recursive network scan
 * @param {NS} ns 
 */
export async function main(ns) {
  const { share, pid, exec } = ns

  exec('tail.js', 'home', 1, ...[pid]);

  while (true) {
    let alreadyVisited = new Set();
    await share()
    await recursiveNeighbors('home', alreadyVisited, ns);
  }
}

/**
 * recursive scan to get all neighbors
 * 
 * @param {String} currentServer - the currently visited server
 * @param {Set} visited - a Set() of the places visited
 * @param {NS} ns - Namespace object providing access to the scripting API.
 * @returns {Promise<Set>}
 */
export const recursiveNeighbors = (currentServer, visited, ns) => {
  const { scan, getServer, print, } = ns;

  return new Promise((resolve) => {
    visited.add(currentServer);

    const neighbors = scan(currentServer); // Who's next door in server world?

    print(`\n starting scan on ${currentServer}... \n`)

    neighbors.forEach(async (neighbor) => {
      const { purchasedByPlayer } = getServer(neighbor);

      if (!visited.has(neighbor) && !purchasedByPlayer) {
        // logging
        print(`neighbor of ${currentServer}: ${neighbor}`);
        await recursiveNeighbors(neighbor, visited, ns);
      }
    })

    resolve(visited)
  })
}