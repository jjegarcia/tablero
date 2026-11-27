import { createRoot } from 'react-dom/client'
import { getSquareType, gridSize } from './board.js'
import './style.css'

const squareLabels = {
  'triple-word': { short: 'TW', description: 'Triple word score' },
  'double-word': { short: 'DW', description: 'Double word score' },
  'triple-letter': { short: 'TL', description: 'Triple letter score' },
  'double-letter': { short: 'DL', description: 'Double letter score' },
  start: { short: '★', description: 'Start, double word score' },
}

function Board() {
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

                return (
                  <div
                    className={`board-cell board-cell--${type}`}
                    role="gridcell"
                    aria-label={`Row ${String.fromCharCode(65 + row)}, column ${column + 1}${label ? `, ${label.description}` : ''}`}
                    key={column}
                  >
                    {label?.short}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

const app = document.querySelector('#app')

if (!app) {
  throw new Error('App mount point not found')
}

createRoot(app).render(<Board />)
