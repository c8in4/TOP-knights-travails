import Graph from "./graph.js";

const testGraph = new Graph();

testGraph.addEdge("[0, 0]", "[1, 2]");

testGraph.printGraph();

console.log(testGraph.vertices.get("[0, 0]").value);
