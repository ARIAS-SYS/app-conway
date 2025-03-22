import { useState, useEffect } from "react";

const operations = [
  [0, 1], [0, -1], [1, -1], [1, 1], [1, 0],
  [-1, -1], [-1, 1], [-1, 0]
];

export const App = () => {  
  const [numRows, setNumRows] = useState(7);
  const [numCols, setNumCols] = useState(7);
  const [numStages, setNumStages] = useState(4);
  const [grid, setGrid] = useState([]);
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);

  const generateEmptyGrid = () => {
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
  };

  useEffect(() => {
    setGrid(generateEmptyGrid());
    setHistory([]);
    setRunning(false);
  }, [numRows, numCols]);

  useEffect(() => {
    if (running) {
      handleStart();
    }
  }, [numStages]); 

  const handleStart = () => {
    let newHistory = [grid];

    for (let stage = 1; stage < numStages; stage++) {
      const prevGrid = newHistory[stage - 1];
      const newGrid = prevGrid.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += prevGrid[newI][newJ];
            }
          });
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          }
          return cell;
        })
      );
      newHistory.push(newGrid);
    }

    setHistory(newHistory);
    setRunning(true);
  };

  return (
    <div className="h-[100vh]">
        <div className="flex flex-col items-center m-10 p-4 text-white card">
        <h1 className="text-2xl font-bold mb-4">Juego de la Vida de Conway</h1>
        <span className="block mb-6">Desarollado por Ronaldo Arias Mamani</span>
        <div className="flex gap-8 items-center ">
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center">
              <label className="mr-2 w-[80px] ">Filas:</label>
              <input type="number" value={numRows} onChange={(e) => setNumRows(Number(e.target.value))} className="border p-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 w-[80px] ">Columnas:</label>
              <input type="number" value={numCols} onChange={(e) => setNumCols(Number(e.target.value))} className="border p-1" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 w-[80px] ">Fases:</label>
              <input type="number" value={numStages} onChange={(e) => setNumStages(Number(e.target.value))} className="border p-1" />
            </div>
          </div>

          {/* Matriz inicial */}
          <div>
            <h2 className="text-lg text-center font-semibold mt-2">Fase Inicial</h2>
            <div className="grid  mt-2" style={{ gridTemplateColumns: `repeat(${numCols}, 25px)` }}>
              {grid.map((row, i) =>
                row.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-[25px] h-[25px] border border-black/60 ${col ? "bg-blue-800" : "bg-gray-300/70"}`}
                    onClick={() => {
                      if (!running) {
                        const newGrid = grid.map((row, x) =>
                          row.map((cell, y) => (x === i && y === j ? (cell ? 0 : 1) : cell))
                        );
                        setGrid(newGrid);
                      }
                    }}
                  />
                ))
              )}
            </div>

            
          </div>
          <div className="flex flex-col">
            {/* Botones con degradado */}
            <button
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded shadow-md"
              onClick={handleStart}
            >
              Iniciar
            </button>
            <button
              className="mt-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded shadow-md"
              onClick={() => {
                setGrid(generateEmptyGrid());
                setHistory([]);
                setRunning(false);
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
        

        {/* Matrices generadas después de iniciar */}
        {running && (
          <div className="flex flex-wrap gap-6 mt-6 mb-8">
            {history.map((stageGrid, index) => (
              <div key={index} className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mt-2">T({index})</h2>
                <div className="grid mt-1" style={{ gridTemplateColumns: `repeat(${numCols}, 30px)` }}>
                  {stageGrid.map((rows, i) =>
                    rows.map((col, j) => (
                      <div
                        key={`${index}-${i}-${j}`}
                        className={`w-[30px] h-[30px] border border-black/70 ${col ? "bg-blue-500" : "bg-white/10"}`}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
