import { createRoot } from 'react-dom/client'
import './style.css'

const gridSize = 15

function Board() {
  return (
    <main className="board-page">
      <h1>Tablero</h1>
      <div className="board" role="grid" aria-label="15 by 15 grid">
        {Array.from({ length: gridSize }, (_, row) => (
          <div className="board-row" role="row" key={row}>
            {Array.from({ length: gridSize }, (_, column) => (
              <div
                className="board-cell"
                role="gridcell"
                aria-label={`Row ${row + 1}, column ${column + 1}`}
                key={column}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}

const app = document.querySelector('#app')

if (!app) {
  throw new Error('App mount point not found')
}

createRoot(app).render(<Board />)
