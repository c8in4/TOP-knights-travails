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

  populateGraph(start, end) {
    this.addVertex(JSON.stringify(start));
    this.addVertex(JSON.stringify(end));
    const startVertex = this.vertices.get(JSON.stringify(start));
    const endVertex = this.vertices.get(JSON.stringify(end));

    startVertex.distance = 0;
    endVertex.heuristic = 0;

    const queue = [startVertex];

    // while still items in queue and end position not explored yet
    while (queue.length && !endVertex.edges.size) {
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

    let currentVertex = endVertex;
    while (currentVertex.predecessor) {
      result.unshift(currentVertex.value);
      const newKey = currentVertex.predecessor;
      const newVertex = this.vertices.get(newKey);
      currentVertex = newVertex;
    }
    result.unshift(startVertex.value);

    return result;
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
