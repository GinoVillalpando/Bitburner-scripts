/** 
 * Continous recursive network scan
 * @param {NS} ns 
 */
export async function main(ns) {
  let alreadyVisited = new Set();

  ns.disableLog('asleep');
  ns.disableLog('scan');
  ns.exec('tail.js', 'home', 1, ...[ns.pid]);


  while (true) {
    alreadyVisited = new Set();
    await ns.asleep(3000);
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
export const recursiveNeighbors = async (currentServer, visited, ns) => {
  visited.add(currentServer);

  const neighbors = ns.scan(currentServer);
  ns.print(`\n starting scan on ${currentServer}... \n`);

  for (const neighbor of neighbors) {
    if (!visited.has(neighbor) && ns.hasRootAccess(neighbor)) {
      const threads = ns.args[0];
      await ns.grow(neighbor, {threads});
      await ns.weaken(neighbor, {threads});
      await ns.hack(neighbor, { threads });
      // ns.print(`neighbor of ${currentServer}: ${neighbor}`);
      await ns.asleep(3000); // Ensuring a delay of 3000 ms between each neighbor's processing
      await recursiveNeighbors(neighbor, visited, ns);
    }
  }

  return visited;
}