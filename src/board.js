export const gridSize = 15

const bonusSquares = {
  '0,0': 'triple-word',
  '0,7': 'triple-word',
  '1,1': 'double-word',
  '2,2': 'double-word',
  '3,3': 'double-word',
  '4,4': 'double-word',
  '1,5': 'triple-letter',
  '5,5': 'triple-letter',
  '0,3': 'double-letter',
  '2,6': 'double-letter',
  '3,7': 'double-letter',
  '6,6': 'double-letter',
}

export function getSquareType(row, column) {
  if (row === 7 && column === 7) return 'start'

  const distances = [row, column]
    .map((coordinate) => Math.min(coordinate, gridSize - 1 - coordinate))
    .sort((a, b) => a - b)

  return bonusSquares[distances.join(',')] ?? 'normal'
}
