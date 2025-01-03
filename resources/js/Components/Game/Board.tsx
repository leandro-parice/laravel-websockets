
import React, { useState, useEffect } from "react";
import Square from "./Square";
import { Game, User } from "@/types/interfaces";
import { usePage } from "@inertiajs/react";

type Player = 'X' | 'O' | null;

interface Move {
    board: Player[];
    currentPlayer: Player;
}

interface Props {
    game: Game;
}

interface GameSquareClickedInterface {
    game: Game;
    user: User;
    order: number;
}

const Board: React.FC<Props> = ({game}) => {
    const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const user = usePage().props.auth.user;

    useEffect(() => {
        const channel = window.Echo.channel(`game.${game.id}`);

        channel.listen('GameSquareClicked', (event: GameSquareClickedInterface) => {
            if (event.user.id !== user.id) {
                console.log('Evento recebido:', event);
                updateSquares(event.order);
            }
        });

        return () => {
            channel.stopListening('GameSquareClicked');
        };
    }, [game.id, user.id]);

    const handleClick = async (index: number) => {
        if(game.user1.id === user.id && currentPlayer === 'O') return;
        
        if(game.user2 && game.user2.id === user.id && currentPlayer === 'X') return;

        if (squares[index] || calculateWinner(squares)) return;
        
        if (currentPlayer !== (user.id === game.user1.id ? 'X' : 'O')) return;

        updateSquares(index);

        try {
            const response = await fetch(`/games/${game.id}/square-click`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ order: index }),
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Erro ao enviar evento:", error);
        }
    };

    const updateSquares = (index: number) => {
        setSquares((prevSquares) => {
            const newSquares = [...prevSquares];
            
            newSquares[index] = currentPlayer;
            return newSquares;
        });
        
        setCurrentPlayer((prevPlayer) => (prevPlayer === 'X' ? 'O' : 'X'));
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

    const checkDraw = (squares: Player[]): boolean => {
        return squares.every((cell) => cell !== null) && !calculateWinner(squares);
    };

    const winner = calculateWinner(squares);
    const isDraw = checkDraw(squares);
    const status = winner
        ? `Vencedor: ${winner}`
        : isDraw ? 'Empatou' : `Próximo jogador: ${currentPlayer === 'X' ? 'X' : 'O'}`;

        
    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-xl font-semibold">{status}</div>
            <div className="grid grid-cols-3 border-gray-400 border">
                {squares.map((square, index) => (
                    <Square key={index} value={square} onClick={() => handleClick(index)} />
                ))}
            </div>
        </div>
    );
}

export default Board;