import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getSquareType, gridSize } from './board.js'

test('board matches the standard bonus square layout', () => {
  const expected = {
    'triple-word': 'A1 A8 A15 H1 H15 O1 O8 O15',
    'double-word': 'B2 B14 C3 C13 D4 D12 E5 E11 K5 K11 L4 L12 M3 M13 N2 N14',
    'triple-letter': 'B6 B10 F2 F6 F10 F14 J2 J6 J10 J14 N6 N10',
    'double-letter': 'A4 A12 C7 C9 D1 D8 D15 G3 G7 G9 G13 H4 H12 I3 I7 I9 I13 L1 L8 L15 M7 M9 O4 O12',
    start: 'H8',
  }
  const actual = Object.fromEntries(Object.keys(expected).map((type) => [type, []]))

  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      const type = getSquareType(row, column)
      if (type !== 'normal') {
        actual[type].push(`${String.fromCharCode(65 + row)}${column + 1}`)
      }
    }
  }

  for (const [type, coordinates] of Object.entries(expected)) {
    assert.deepEqual(actual[type].sort(), coordinates.split(' ').sort(), type)
  }
})
