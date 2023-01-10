//performs dijkstra's algorithm
//returns all nodes in order that are visited
// all nodes set to a distance of infinity except for starting node (= 0)
export function dijkstra (grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  //array of all unvisited nodes from the grid
  const unvisitedNodes = getAllNodes(grid);
  //while there are still nodes to visit,
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    //grab the head of the unvisited node array
    // initially, the closestnode is the starting node
    const closestNode = unvisitedNodes.shift();
    // if the node is a wall, just skip 
    if (closestNode.isWall) continue;
    //if trapped, the alg should stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    //otherwise append the closest node to the array of visited nodes
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    //update closestneighbor to be visited
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  // for every unvisited neighboring node, assign plus one to the distance
  for (const neighbor of unvisitedNeighbors) {
    //startingNode.distance + 1 initially
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

//nearest surrounding unvisited nodes
function getUnvisitedNeighbors(node, grid){
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]); // top
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); //bottom
  if (col > 0) neighbors.push(grid[row][col - 1]); //left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); //right
  //filter out neighbors that have been visited
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    //appends the currentNode to the front of the array
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}