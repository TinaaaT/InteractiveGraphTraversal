
export function depthFirstSearch (grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  while (stack){
    const nextNode = stack.pop();
    if (nextNode.isWall) continue;
    if (nextNode.isVisited) continue;
    
    nextNode.isVisited = true;
   // if (closestNode.distance === Infinity) return visitedNodesInOrder;
   if (nextNode.distance === Infinity) return visitedNodesInOrder;

    visitedNodesInOrder.push(nextNode);
    if(nextNode === finishNode) return visitedNodesInOrder;
     const neighbors = getUnvisitedNeighbors(nextNode, grid);
     for (const neighbor of neighbors){
      neighbor.distance = nextNode.distance + 1;
      neighbor.previousNode = nextNode;
      stack.push(neighbor);
      
     }
  }
  
  
}



function getUnvisitedNeighbors(node, grid){
  const neighbors = [];
  const {col, row} = node;
  if (row > 0 ) neighbors.push(grid[row - 1][col]); // top
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); //bottom
  if (col > 0) neighbors.push(grid[row][col - 1]); //left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); //right
  //filter out neighbors that have been visited
  return neighbors.filter(neighbor => !neighbor.isVisited);
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







