import { test } from 'node:test'
import assert from 'node:assert/strict'
import { placeTile, returnTile, tiles } from './tiles.js'

test('international Spanish set contains the expected tiles and scores', () => {
  const expected = {
    A: [12, 1], B: [2, 3], C: [4, 3], CH: [1, 5], D: [5, 2],
    E: [12, 1], F: [1, 4], G: [2, 2], H: [2, 4], I: [6, 1],
    J: [1, 8], L: [4, 1], LL: [1, 8], M: [2, 3], N: [5, 1],
    'Ñ': [1, 8], O: [9, 1], P: [2, 3], Q: [1, 5], R: [5, 1],
    RR: [1, 8], S: [6, 1], T: [4, 1], U: [5, 1], V: [1, 4],
    X: [1, 8], Y: [1, 4], Z: [1, 10], '': [2, 0],
  }
  assert.equal(tiles.length, 100)
  assert.equal(new Set(tiles.map((tile) => tile.id)).size, 100)
  for (const [letter, [count, points]] of Object.entries(expected)) {
    const matching = tiles.filter((tile) => tile.letter === letter)
    assert.equal(matching.length, count, letter)
    assert.ok(matching.every((tile) => tile.points === points), letter)
  }
})

test('tiles can be placed, moved and returned without replacing other tiles', () => {
  const first = tiles[0].id
  const second = tiles[1].id
  const initial = placeTile({}, first, 0)
  const withSecond = placeTile(initial, second, 1)
  assert.deepEqual(initial, { 0: first })
  assert.equal(placeTile(withSecond, first, 1), withSecond)
  const moved = placeTile(withSecond, first, 224)
  assert.deepEqual(moved, { 1: second, 224: first })
  assert.deepEqual(returnTile(moved, first), { 1: second })
  assert.throws(() => placeTile({}, first, 225), RangeError)
  assert.throws(() => placeTile({}, 'missing', 0), /Unknown tile/)
})

test('tiles move between board and temporary grid without duplicates or overwriting', () => {
  const first = tiles[0].id
  const second = tiles[1].id
  const onBoard = placeTile({}, first, 0)
  const temporary = placeTile(onBoard, first, 0, 'temporary')
  assert.deepEqual(temporary, { 'temporary-0': first })
  const occupied = placeTile(temporary, second, 1, 'temporary')
  assert.equal(placeTile(occupied, first, 1, 'temporary'), occupied)
  const backOnBoard = placeTile(occupied, first, 224)
  assert.deepEqual(backOnBoard, { 224: first, 'temporary-1': second })
  assert.deepEqual(returnTile(backOnBoard, second), { 224: first })
  assert.deepEqual(placeTile({}, first, 15, 'temporary'), { 'temporary-15': first })
  assert.throws(() => placeTile({}, first, 16, 'temporary'), RangeError)
  assert.throws(() => placeTile({}, first, 0, 'unknown'), /Unknown area/)
})
