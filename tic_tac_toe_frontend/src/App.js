import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Minimal, modern UI
 * - Blue (#2563EB) and amber (#F59E0B) accents
 * - Subtle gradient backgrounds and shadows
 * - Smooth transitions and rounded corners
 */

// Helpers
const OCEAN = '#2563EB';
const AMBER = '#F59E0B';
const ERROR = '#EF4444';

// Compute winner for a 3x3 board
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This component renders the complete Tic Tac Toe game, including:
   * - Centered 3x3 grid board
   * - Two-player interactive gameplay with X and O
   * - Move history with time travel
   * - Reset/Restart controls
   * - Minimal, modern "Ocean Professional" styling
   */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const result = useMemo(() => calculateWinner(currentSquares), [currentSquares]);
  const winner = result?.player || null;
  const winningLine = result?.line || [];

  const isDraw = !winner && currentSquares.every(Boolean);

  function handlePlay(nextSquares, indexPlayed) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSquareClick(index) {
    if (winner || currentSquares[index]) return;
    const nextSquares = currentSquares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    handlePlay(nextSquares, index);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="ocean-app">
      <div className="ocean-gradient" />
      <main className="container">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Play the classic 2-player game</p>
        </header>

        <section className="game">
          <div className="board-card">
            <div className="status-row" role="status" aria-live="polite">
              <span className={`status-badge ${winner ? 'win' : isDraw ? 'draw' : 'next'}`}>
                {status}
              </span>
              <button className="btn ghost" onClick={resetGame} aria-label="Restart game">
                Restart
              </button>
            </div>

            <Board
              squares={currentSquares}
              onSquareClick={handleSquareClick}
              winningLine={winningLine}
              xIsNext={xIsNext}
            />

            <div className="controls">
              <div className="history-header">
                <h2 className="history-title">Move History</h2>
                <button
                  className="btn toggle"
                  onClick={() => setIsAscending((v) => !v)}
                  aria-label="Toggle move order"
                >
                  {isAscending ? 'Ascending' : 'Descending'}
                </button>
              </div>
              <History
                history={history}
                currentMove={currentMove}
                onJumpTo={jumpTo}
                isAscending={isAscending}
              />
            </div>
          </div>
        </section>

        <footer className="footer">
          <p className="footnote">Ocean Professional UI • Modern • Minimal</p>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine, xIsNext }) {
  /** Renders the 3x3 board with interactive squares. Highlights winning cells. */
  function renderSquare(i) {
    const value = squares[i];
    const isWinnerCell = winningLine.includes(i);
    const isActiveTurn = !value && !winningLine.length;
    const ariaLabel = `Cell ${i + 1}, ${value ? value : 'empty'}`;

    return (
      <button
        key={i}
        className={`square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${
          isWinnerCell ? 'winner' : ''
        } ${isActiveTurn ? 'active' : ''}`}
        onClick={() => onSquareClick(i)}
        aria-label={ariaLabel}
        disabled={Boolean(value) || Boolean(winningLine.length)}
      >
        <span className="mark">{value}</span>
      </button>
    );
  }

  return (
    <div className="board" role="grid" aria-label={`Tic Tac Toe board. ${xIsNext ? 'X' : 'O'} to move.`}>
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}

// PUBLIC_INTERFACE
function History({ history, currentMove, onJumpTo, isAscending }) {
  /** Lists moves with the ability to time-travel to a previous state. */
  const items = history.map((_, move) => {
    const description = move === 0 ? 'Go to game start' : `Go to move #${move}`;
    const isCurrent = move === currentMove;
    return (
      <li key={move}>
        <button
          className={`history-btn ${isCurrent ? 'current' : ''}`}
          onClick={() => onJumpTo(move)}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {description}
        </button>
      </li>
    );
  });

  const orderedItems = isAscending ? items : [...items].reverse();

  return <ol className="history-list">{orderedItems}</ol>;
}
