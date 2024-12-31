
import React, { useState } from "react";
import Square from "./Square";

type Player = 'X' | 'O' | null;

interface Move {
    board: Player[];
    currentPlayer: Player;
}

const Board: React.FC = () => {
    const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [history, setHistory] = useState<Move[]>([]);

    const handleClick = (index: number) => {
        if (squares[index] || calculateWinner(squares)) return;

        const newSquares = [...squares];
        newSquares[index] = currentPlayer;

        setHistory([...history, { board: [...squares], currentPlayer }]);

        setSquares(newSquares);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    const calculateWinner = (squares: Player[]) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setCurrentPlayer('X');
        setHistory([]);
    };

    const checkDraw = (squares: Player[]): boolean => {
        return squares.every((cell) => cell !== null) && !calculateWinner(squares);
    };

    const winner = calculateWinner(squares);
    const isDraw = checkDraw(squares);
    const status = winner
        ? `Vencedor: ${winner}`
        : isDraw ? 'Empatou' : `Próximo jogador: ${currentPlayer === 'X' ? 'X' : 'O'}`;

        // const finishGame = async (winner: string) => {
        //     try {
        //         const response = await fetch(`/games/${gameId}/finish`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        //             },
        //             body: JSON.stringify({
        //                 winner,
        //                 histories: history.map((move, index) => ({
        //                     position: index,
        //                     player: move.currentPlayer,
        //                 })),
        //             }),
        //         });
        
        //         if (response.ok) {
        //             alert('Jogo salvo com sucesso!');
        //         } else {
        //             alert('Erro ao salvar o jogo.');
        //         }
        //     } catch (error) {
        //         console.error('Erro ao finalizar o jogo:', error);
        //     }
        // };

        
    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-xl font-semibold">{status}</div>
            <div className="grid grid-cols-3 border-gray-400 border">
                {squares.map((square, index) => (
                    <Square key={index} value={square} onClick={() => handleClick(index)} />
                ))}
            </div>
            <div className="history">
                <h2>Histórico</h2>
                <ul>
                    {history.map((move, index) => (
                        <li key={index}>
                            Jogador: {move.currentPlayer}, Tabuleiro: {JSON.stringify(move.board)}
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Reiniciar
            </button>
        </div>
    );
}

export default Board;