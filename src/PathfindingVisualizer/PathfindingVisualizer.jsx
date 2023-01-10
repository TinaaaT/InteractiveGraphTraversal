import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {depthFirstSearch} from '../algorithms/depthFirstSearch';
const start_node_r = 10;
const start_node_c = 15;
const finish_node_r = 10;
const finish_node_c = 35;

export default class PathfindingVisualizer extends Component {
	constructor(props) {
		super(props);
    // object with 2 attributes: grid, mouseispressed
		this.state = {
			grid: [],
      mouseIsPressed: false,
	  };
	}

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  // mouse functions
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }    

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }
  
  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //animates shortest path after all the surrounding nodes have been checked 
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }
 
  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[start_node_r][start_node_c];
    const finishNode = grid[finish_node_r][finish_node_c];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

  }

  visualizeDFS() {
    const {grid} = this.state;
    const startNode = grid[start_node_r][start_node_c];
    const finishNode = grid[finish_node_r][finish_node_c];
    const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  //renders html code
	render(){
    // {grid, mouseIsPressed} deconstructs the object state 
    //equiv to const grid = this.state.grid
		const {grid, mouseIsPressed} = this.state;
		//console.log(nodes)

    return (
      <> 
        <header class="title">Pathfinding Visualizer</header>
        <button onClick={() => this.visualizeDijkstra()} class="button">
          Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeDFS()} class="button">
          SomeOther Algorithm
        </button>
        <button onClick={() => resetGrid()} class="button">Reset</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return ( 
              <div key = {rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {isStart, isFinish, row, col, isWall} = node;
                  return (
                    <Node                                                                                                                                                                                                                                        
                      key = {nodeIdx}
                      //pass start and finish based on nodeidx
                      //assigning js const to html vars
                      isStart = {isStart}
                      isFinish = {isFinish}
                      col = {col}
                      row = {row}
                      isWall = {isWall}
                      mouseIsPressed = {mouseIsPressed}
                      onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter = {(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp = {(row, col) => this.handleMouseUp()}
                      ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
	}
}
// need to reset a few funcs.. vars..
function resetGrid(){
  const grid = getInitialGrid();
  for (const node of grid){
    document.getElementById(`node-${node.row}-${node.col}`).className =
      'node';
  }

  this.setState({grid});
}
//creating the initial grid
//  grid = [[node, node, node]        node = (col, row)
//          [node, node, node]
//          [node, node, node]]
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 40; col ++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// const function - "read-only" function,
// allows for immutable pointer but not immutable values
//just another way to write js functions..

//takes in a col n row and produces some properties that might be needed later
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === start_node_r && col === start_node_c,
    isFinish: row === finish_node_r && col === finish_node_c,

    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};


const getNewGridWithWallToggled = (grid, row, col) => {
  //if(row !== start_node_r && col !== start_node_c){
  const newGrid = grid.slice();
  // create a node repping the toggled "wall"
  const node = newGrid[row][col];
  // changed node object
  const newNode = {
    ...node, //?
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
  //}
};

