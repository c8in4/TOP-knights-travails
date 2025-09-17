function isValidPosition([x, y]) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7
}

function getValidMoves([x, y]) {
  const POSSIBLE_MOVES = [
    [x + 1, y + 2],
    [x + 1, y - 2],
    [x - 1, y + 2],
    [x - 1, y - 2],
    [x + 2, y + 1],
    [x + 2, y - 1],
    [x - 2, y + 1],
    [x - 2, y - 1],
  ];

  const moves = [];

  POSSIBLE_MOVES.forEach(([x, y]) => moves.push([x, y]));

  return moves.filter(([x, y]) => isValidPosition([x, y]));
}

function isSamePosition(pos1, pos2) {
  return (JSON.stringify(pos1) == JSON.stringify(pos2))
}

function knightMoves(start, end) {
  // check inputs for validity
  if (!isValidPosition(start) || !isValidPosition(end)) {
    return console.log("Your start and/or end coordinates are out of range (0-7).");
  }
  if (isSamePosition(start, end)) {
    return console.log("You are already there.")
  }

  const queue = [{ position: start, parent: null }]
  const visited = new Map()
  let current = queue[0]

  // explore moves from start position to reach end position
  while (queue.length && !isSamePosition(current.position, end)) {
    current = queue.shift()
    if (!visited.has(JSON.stringify(current.position))) {
      visited.set(JSON.stringify(current.position), current)
    }
    getValidMoves(current.position).forEach(move => {
      queue.push({ position: move, parent: current.position })
    })
  }

  const shortestPath = []

  // retrace steps
  while (current.parent) {
    shortestPath.unshift(current.position)
    current = visited.get(JSON.stringify(current.parent))
  }
  shortestPath.unshift(start)

  // log result
  console.log(`You made it in ${shortestPath.length - 1} moves! Here's your path:`);
  shortestPath.forEach((position) => console.log(position));
}

knightMoves([0, 0], [1, 2]);

knightMoves([0, 0], [3, 3])

knightMoves([3, 3], [0, 0])

knightMoves([0, 0], [7, 7])
