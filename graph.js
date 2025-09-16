const PATH_WEIGHT = 3;

class Vertex {
  constructor(key) {
    this.key = key;
    this.value = JSON.parse(key);
    this.distance = Infinity;
    // this.heuristic = null;
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

  populateGraph(start, end) {
    this.addVertex(JSON.stringify(start));
    this.addVertex(JSON.stringify(end));
    const startVertex = this.vertices.get(JSON.stringify(start));
    const endVertex = this.vertices.get(JSON.stringify(end));

    startVertex.distance = 0;
    // endVertex.heuristic = 0;

    const queue = [startVertex];

    while (queue.length && !endVertex.edges.size) {
      queue.sort((a, b) => {
        return a.distance + a.heuristic - (b.distance + b.heuristic);
      });
      let currentVertex = queue.shift();

      const possibleMoves = calculateAdjecents(currentVertex.value);
      possibleMoves.forEach((move) => {
        this.addEdge(currentVertex.key, JSON.stringify(move));
        const newVertex = this.vertices.get(JSON.stringify(move));
        queue.push(newVertex);
      });
    }
  }

  // find paths
  findPaths(start) {
    const startVertex = this.vertices.get(JSON.stringify(start));

    let queue = [startVertex];
    const visited = new Set();

    while (queue.length) {
      const currentVertex = queue.shift();
      visited.add(currentVertex);
      const neighborsKeys = currentVertex.edges.keys();
      // console.log(neighborsKeys);
      neighborsKeys.forEach((neighborKey) => {
        const currentNeigbor = this.vertices.get(neighborKey);
        if (currentVertex.distance + 3 < currentNeigbor.distance) {
          currentNeigbor.distance = currentVertex.distance + 3;
          currentNeigbor.predecessor = currentVertex.key;
        }
        if (!visited.has(currentNeigbor)) {
          queue.push(currentNeigbor);
        }
        sortQueue();
      });
    }
    function sortQueue() {
      queue = queue.sort((a, b) => {
        return a.distance - b.distance;
      });
    }
  }

  retraceSteps(start, end) {
    const startVertex = this.vertices.get(JSON.stringify(start));
    const endVertex = this.vertices.get(JSON.stringify(end));

    const result = [];

    let currentTracer = endVertex;
    while (currentTracer.predecessor) {
      result.unshift(currentTracer.value);
      const newKey = currentTracer.predecessor;
      const newVertex = this.vertices.get(newKey);
      currentTracer = newVertex;
    }
    result.unshift(startVertex.value);

    return result;
  }

  bfsTraversal(startKey, endKey) {
    if (!this.vertices.has(startKey)) {
      throw new Error("Starting vertex does not exist.");
    }

    const queue = [startKey];
    const visited = new Set();

    while (queue) {
      const currentKey = queue.shift();
      if (currentKey == endKey) {
        return this.vertices.get(currentKey);
      }

      if (!visited.has(currentKey)) {
        visited.add(currentKey);
        const neighbors = Array.from(
          this.vertices.get(currentKey).edges.keys()
        );
        queue.push(...neighbors.filter((neighbor) => !visited.has(neighbor)));
      }
    }

    return null;
  }

  printGraph() {
    this.vertices.forEach((vertex, key) => {
      const edges = Array.from(vertex.edges).map(
        // Format each edge with its destination and weight
        ([destinationKey, weight]) => `${destinationKey}(${weight})`
      );
      // Print each vertex and its connected edges
      console.log(`${key} (d: ${vertex.distance}) -> ${edges.join(", ")}`);
    });
  }
}

// helper functions:
function calculateAdjecents(coordinates) {
  const POSSIBLE_MOVES = [
    [coordinates[0] + 1, coordinates[1] + 2],
    [coordinates[0] + 1, coordinates[1] - 2],
    [coordinates[0] - 1, coordinates[1] + 2],
    [coordinates[0] - 1, coordinates[1] - 2],
    [coordinates[0] + 2, coordinates[1] + 1],
    [coordinates[0] + 2, coordinates[1] - 1],
    [coordinates[0] - 2, coordinates[1] + 1],
    [coordinates[0] - 2, coordinates[1] - 1],
  ];

  const result = [];

  POSSIBLE_MOVES.forEach((move) => {
    if (move[0] >= 0 && move[0] <= 7 && move[1] >= 0 && move[1] <= 7) {
      result.push(move);
    }
  });

  return result;
}

function calculateHeuristic(a, b) {
  const deltaX = Math.abs(a[0] - b[0]);
  const deltaY = Math.abs(a[1] - b[1]);

  return Math.floor(Math.sqrt(deltaX ** 2 + deltaY ** 2));
}
