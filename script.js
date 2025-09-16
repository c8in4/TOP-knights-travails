import Graph from "./graph.js";

knightMoves([0, 0], [3, 4]);

function knightMoves(start, end) {
  if (JSON.stringify(start) == JSON.stringify(end)) {
    return console.log("You are already there.");
  }

  const knightMovesGraph = new Graph();
  knightMovesGraph.populateGraph(start, end);
  
  knightMovesGraph.printGraph();

  console.log("number of explored positions:", knightMovesGraph.vertices.size);

  const result = knightMovesGraph.bfsTraversal(
    JSON.stringify(start),
    JSON.stringify(end)
  );
  console.log(result);
}
