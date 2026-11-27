import { gridSize } from './board.js'

export const spanishTileDistribution = [
  ['A', 1, 12], ['B', 3, 2], ['C', 3, 4], ['CH', 5, 1],
  ['D', 2, 5], ['E', 1, 12], ['F', 4, 1], ['G', 2, 2],
  ['H', 4, 2], ['I', 1, 6], ['J', 8, 1], ['L', 1, 4],
  ['LL', 8, 1], ['M', 3, 2], ['N', 1, 5], ['Ñ', 8, 1],
  ['O', 1, 9], ['P', 3, 2], ['Q', 5, 1], ['R', 1, 5],
  ['RR', 8, 1], ['S', 1, 6], ['T', 1, 4], ['U', 1, 5],
  ['V', 4, 1], ['X', 8, 1], ['Y', 4, 1], ['Z', 10, 1],
  ['', 0, 2],
]

export const tiles = spanishTileDistribution.flatMap(([letter, points, count]) =>
  Array.from({ length: count }, (_, index) => ({
    id: `${letter || 'blank'}-${index}`,
    letter,
    points,
  })),
)

export function placeTile(placements, tileId, cellIndex) {
  if (!tiles.some((tile) => tile.id === tileId)) {
    throw new Error(`Unknown tile: ${tileId}`)
  }
  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= gridSize * gridSize) {
    throw new RangeError(`Invalid cell: ${cellIndex}`)
  }
  if (placements[cellIndex] && placements[cellIndex] !== tileId) return placements

  const next = { ...placements }
  for (const [cell, id] of Object.entries(next)) {
    if (id === tileId) delete next[cell]
  }
  next[cellIndex] = tileId
  return next
}

export function returnTile(placements, tileId) {
  return Object.fromEntries(Object.entries(placements).filter(([, id]) => id !== tileId))
}
