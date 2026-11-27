import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getSquareType, gridSize } from './board.js'
import { placeTile, returnTile, tiles } from './tiles.js'
import './style.css'

const squareLabels = {
  'triple-word': { short: 'TW', description: 'Triple word score' },
  'double-word': { short: 'DW', description: 'Double word score' },
  'triple-letter': { short: 'TL', description: 'Triple letter score' },
  'double-letter': { short: 'DL', description: 'Double letter score' },
  start: { short: '★', description: 'Start, double word score' },
}

function Board() {
  const [placements, setPlacements] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [drag, setDrag] = useState(null)
  const [message, setMessage] = useState('Select a tile, then select an empty square, or drag a tile onto the board.')
  const pointer = useRef(null)
  const suppressClick = useRef(false)
  const tileById = Object.fromEntries(tiles.map((tile) => [tile.id, tile]))
  const placedIds = new Set(Object.values(placements))

  function tileName(tile) {
    return tile.letter ? `${tile.letter}, ${tile.points} points` : 'Blank, 0 points'
  }

  function selectTile(tile) {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    const selected = selectedId !== tile.id
    setSelectedId(selected ? tile.id : null)
    setMessage(selected ? `${tileName(tile)} selected. Choose an empty square.` : 'Tile deselected.')
  }

  function moveTile(tileId, cellIndex) {
    if (placements[cellIndex] && placements[cellIndex] !== tileId) {
      setMessage('That square is occupied. Choose an empty square.')
      return
    }
    setPlacements((current) => placeTile(current, tileId, cellIndex))
    setSelectedId(null)
    setMessage(`${tileName(tileById[tileId])} placed at ${String.fromCharCode(65 + Math.floor(cellIndex / gridSize))}${cellIndex % gridSize + 1}.`)
  }

  function onPointerDown(event, tile) {
    if (event.button !== 0 || !event.isPrimary) return
    pointer.current = { id: event.pointerId, tileId: tile.id, x: event.clientX, y: event.clientY, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event) {
    const active = pointer.current
    if (!active || active.id !== event.pointerId) return
    if (!active.moved && Math.hypot(event.clientX - active.x, event.clientY - active.y) < 6) return
    active.moved = true
    setDrag({ tileId: active.tileId, x: event.clientX, y: event.clientY })
  }

  function onPointerUp(event) {
    const active = pointer.current
    if (!active || active.id !== event.pointerId) return
    pointer.current = null
    setDrag(null)
    if (!active.moved) return

    suppressClick.current = true
    window.setTimeout(() => { suppressClick.current = false }, 0)
    const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell-index]')
    if (cell) {
      moveTile(active.tileId, Number(cell.dataset.cellIndex))
    } else {
      setMessage('Drop the tile on a board square.')
    }
  }

  function tileButton(tile, coordinate = null) {
    return (
      <button
        type="button"
        className={`tile${coordinate ? ' tile--board' : ''}${selectedId === tile.id ? ' tile--selected' : ''}`}
        aria-label={`${tileName(tile)}${coordinate ? `, at ${coordinate}` : ''}`}
        aria-pressed={selectedId === tile.id}
        onClick={() => selectTile(tile)}
        onPointerDown={(event) => onPointerDown(event, tile)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointer.current = null; setDrag(null) }}
      >
        <span>{tile.letter}</span>
        <span className="tile-points" aria-hidden="true">{tile.points}</span>
      </button>
    )
  }

  return (
    <main className="board-page">
      <h1>Tablero</h1>
      <div className="board-layout">
        <div className="column-labels" aria-hidden="true">
          {Array.from({ length: gridSize }, (_, column) => (
            <span key={column}>{column + 1}</span>
          ))}
        </div>
        <div className="row-labels" aria-hidden="true">
          {Array.from({ length: gridSize }, (_, row) => (
            <span key={row}>{String.fromCharCode(65 + row)}</span>
          ))}
        </div>
        <div className="board" role="grid" aria-label="15 by 15 grid">
          {Array.from({ length: gridSize }, (_, row) => (
            <div className="board-row" role="row" key={row}>
              {Array.from({ length: gridSize }, (_, column) => {
                const type = getSquareType(row, column)
                const label = squareLabels[type]
                const cellIndex = row * gridSize + column
                const tile = tileById[placements[cellIndex]]
                const coordinate = `${String.fromCharCode(65 + row)}${column + 1}`

                return (
                  <div
                    className={`board-cell board-cell--${type}`}
                    role="gridcell"
                    data-cell-index={cellIndex}
                    key={column}
                  >
                    {tile ? tileButton(tile, coordinate) : (
                      <button
                        type="button"
                        className="cell-target"
                        aria-label={`${coordinate}${label ? `, ${label.description}` : ''}`}
                        onClick={() => {
                          if (selectedId) moveTile(selectedId, cellIndex)
                          else setMessage('Select a tile first.')
                        }}
                      >
                        {label?.short}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <section className="tile-section" aria-labelledby="tiles-heading">
        <div className="tile-heading">
          <h2 id="tiles-heading">Spanish tiles</h2>
          <span>{tiles.length - placedIds.size} remaining</span>
        </div>
        <p className="instructions">Select a tile and an empty square, or drag a tile onto the board.</p>
        <p className="status" role="status">{message}</p>
        <button
          type="button"
          className="return-button"
          disabled={!selectedId || !placedIds.has(selectedId)}
          onClick={() => {
            setPlacements((current) => returnTile(current, selectedId))
            setMessage(`${tileName(tileById[selectedId])} returned to the tiles.`)
            setSelectedId(null)
          }}
        >
          Return selected tile
        </button>
        <div className="tile-tray">
          {tiles.filter((tile) => !placedIds.has(tile.id)).map((tile) => (
            <div key={tile.id}>{tileButton(tile)}</div>
          ))}
        </div>
      </section>
      {drag && (
        <div className="drag-preview" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <span>{tileById[drag.tileId].letter}</span>
          <span className="tile-points">{tileById[drag.tileId].points}</span>
        </div>
      )}
    </main>
  )
}

const app = document.querySelector('#app')

if (!app) {
  throw new Error('App mount point not found')
}

createRoot(app).render(<Board />)
