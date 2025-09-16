import Graph from "./graph.js";

knightMoves([1, 0], [4, 5]);

function knightMoves(start, end) {
  if (JSON.stringify(start) == JSON.stringify(end)) {
    return console.log("You are already there.");
  }

  // build graph
  const knightMovesGraph = new Graph();

  // populate graph from start until end is found
  knightMovesGraph.populateGraph(start, end);

  // find paths
  knightMovesGraph.findPaths(start);

  // retrace steps
  const result = knightMovesGraph.retraceSteps(start, end);

  // log result
  console.log(`You made it in ${result.length - 1} moves! Here's your path:`);
  result.forEach((position) => console.log(position));
}
