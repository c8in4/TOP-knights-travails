const PATH_WEIGHT = 3;

class Vertex {
  constructor(key) {
    this.key = key;
    this.value = JSON.parse(key);
    this.distance = Infinity;
    this.heuristic = null;
    this.predecessor = null;
    this.edges = new Map();
  }

  addEdge(destinationKey, weight = PATH_WEIGHT) {
    this.edges.set(destinationKey, weight);
  }

  removeEdge(destinationKey) {
    this.edges.delete(destinationKey);
  }
}

export default class Graph {
  constructor() {
    this.vertices = new Map();
  }

  addVertex(key) {
    if (this.vertices.has(key)) {
      return;
    } else {
      this.vertices.set(key, new Vertex(key));
    }
  }

  addEdge(sourceKey, destinationKey, weight = PATH_WEIGHT) {
    this.addVertex(sourceKey);
    this.addVertex(destinationKey);
    this.vertices.get(sourceKey).addEdge(destinationKey, weight);
    this.vertices.get(destinationKey).addEdge(sourceKey, weight);
  }

  removeVertex(key) {
    if (!this.vertices.has(key)) return;

    const vertex = this.vertices.get(key);
    vertex.edges.forEach((_, destKey) => {
      this.vertices.get(destKey).removeEdge(key);
    });
    this.vertices.forEach((vertex) => vertex.removeEdge(key));
    this.vertices.delete(key);
  }

  removeEdge(sourceKey, destinationKey) {
    if (!this.vertices.has(sourceKey) || !this.vertices.has(destinationKey)) {
      throw new Error("Both vertices must exist to remove an edge.");
    }
    this.vertices.get(sourceKey).removeEdge(destinationKey);
    this.vertices.get(destinationKey).removeEdge(sourceKey);
  }

  printGraph() {
    this.vertices.forEach((vertex, key) => {
      const edges = Array.from(vertex.edges).map(
        // Format each edge with its destination and weight
        ([destinationKey, weight]) => `${destinationKey}(${weight})`
      );
      // Print each vertex and its connected edges
      console.log(`${key} -> ${edges.join(", ")}`);
    });
  }
}
