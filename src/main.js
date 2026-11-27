import './style.css'

const gridSize = 15
const app = document.querySelector('#app')

if (!app) {
  throw new Error('App mount point not found')
}

app.innerHTML = `
  <main class="board-page">
    <h1>Tablero</h1>
    <div class="board" role="grid" aria-label="15 by 15 grid">
      ${Array.from({ length: gridSize }, (_, row) => `
        <div class="board-row" role="row">
          ${Array.from({ length: gridSize }, (_, column) => `
            <div class="board-cell" role="gridcell" aria-label="Row ${row + 1}, column ${column + 1}"></div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </main>
`
