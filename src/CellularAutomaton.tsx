import React, { useState, useEffect, useRef } from 'react';

const CellularAutomaton: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [generations, setGenerations] = useState<number>(100);
  const [matrixLength, setMatrixLength] = useState<number>(200);
  const [ruleNumber, setRuleNumber] = useState<number>(30);

  useEffect(() => {

  }, [generations, matrixLength, ruleNumber]);

  const initializeMatrix = (length: number): number[] => {
    const matrix = Array(length).fill(0);
    matrix[Math.floor(length / 2)] = 1; // Configura la célula inicial encendida en el medio
    return matrix;
  };

  const drawGeneration = (matrix: number[], ctx: CanvasRenderingContext2D, generation: number, cellSize: number) => {
    ctx.fillStyle = 'black';
    matrix.forEach((cell, index) => {
      if (cell === 1) {
        ctx.fillRect(index * cellSize, generation * cellSize, cellSize, cellSize);
      }
    });
  };

  const generateRule = (ruleNumber: number): number[] => {
    return ruleNumber.toString(2).padStart(8, '0').split('').map(Number).reverse();
  };

  const computeNextGeneration = (matrix: number[], rule: number[]): number[] => {
    const newMatrix = [...matrix];
    for (let i = 1; i < matrix.length - 1; i++) {
      const pattern = matrix.slice(i - 1, i + 2).reverse().join('');
      const index = parseInt(pattern, 2);
      newMatrix[i] = rule[index];
    }
    return newMatrix;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lógica para calcular y dibujar el autómata celular de Wolfram
    const cellSize = canvas.width / matrixLength;
    let matrix = initializeMatrix(matrixLength);
    const rule = generateRule(ruleNumber);

    for (let generation = 0; generation < generations; generation++) {
      drawGeneration(matrix, ctx, generation, cellSize);
      matrix = computeNextGeneration(matrix, rule);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          Cantidad de generaciones:
          <input type="number" value={generations} onChange={(e) => setGenerations(parseInt(e.target.value, 10))} />
        </label>
        <label>
          Longitud de la matriz:
          <input type="number" value={matrixLength} onChange={(e) => setMatrixLength(parseInt(e.target.value, 10))} />
        </label>
        <label>
          Número de la regla de Wolfram:
          <input type="number" value={ruleNumber} onChange={(e) => setRuleNumber(parseInt(e.target.value, 10))} />
        </label>
        <button type="submit">Calcular</button>
      </form>
      <canvas ref={canvasRef} width={800} height={800}></canvas>
    </div>
  );
};

export default CellularAutomaton;
