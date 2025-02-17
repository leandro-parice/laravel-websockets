
import React, { useState, useEffect, useMemo } from "react";
import Square from "./Square";
import { Game, User } from "@/types/interfaces";
import { usePage } from "@inertiajs/react";

type Player = 'X' | 'O' | null;

interface Props {
    game: Game;
}

interface GameSquareClickedInterface {
    game: Game;
    user: User;
    order: number;
}

interface GameStatusUpdatedInterface{
    game: Game;
}

const Board: React.FC<Props> = ({game}) => {
    const [currentGame, setCurrentGame] = useState(game);
    const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
    const user = usePage().props.auth.user;
    const isUser1 = currentGame.user1.id === user.id;
    const isWatching = currentGame.user2 && user.id !== currentGame.user1.id && user.id !== currentGame.user2.id;
    const opponentSymbol: Player = isUser1 ? 'O' : 'X';

    useEffect(() => {
        const syncSquares = () => {
            const updatedSquares = Array(9).fill(null);
            currentGame.moves.forEach((move, index) => {
                // Alterna entre X e O com base na posição do movimento
                updatedSquares[move.position] = index % 2 === 0 ? 'X' : 'O';
            });
            setSquares(updatedSquares);
        };
    
        // Inicializa o tabuleiro com base nos movimentos já realizados
        syncSquares();
    
        const channel = window.Echo.channel(`game.${game.id}`);
    
        channel.listen('GameSquareClicked', (event: GameSquareClickedInterface) => {
            // Atualiza o tabuleiro com o novo movimento
            setCurrentGame((prevGame) => ({
                ...prevGame,
                moves: [...prevGame.moves, { position: event.order, user_id: event.user.id, game_id: game.id, id: 1 }],
            }));
            updateSquares(event.order);
        });
    
        channel.listen('GameStatusUpdated', (event: GameStatusUpdatedInterface) => {
            setCurrentGame(event.game);
            syncSquares(); // Recalcula o tabuleiro para espectadores
        });
    
        return () => {
            channel.stopListening('GameSquareClicked');
            channel.stopListening('GameStatusUpdated');
        };
    }, [game, currentGame]);

    const handleClick = async (index: number) => {
        console.log('clicou', currentGame);
        if(!currentGame.user2 || isWatching || currentGame.status !== 'playing') return;
        if (squares[index] || calculateWinner(squares)) return;

        const currentPlayer = calculateCurrentPlayer();
        const userSymbol = user.id === currentGame.user1.id ? 'X' : 'O';

        if (currentPlayer !== userSymbol) return;

        updateSquares(index);

        try {
            const response = await fetch(`/games/${currentGame.id}/square-click`, {
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
            const movesCount = prevSquares.filter((square) => square !== null).length;
            // Alterna o símbolo com base na quantidade de movimentos já realizados
            const symbol = movesCount % 2 === 0 ? 'X' : 'O';
            newSquares[index] = symbol;
            return newSquares;
        });
    };

    const calculateCurrentPlayer = (): Player => {
        const movesCount = squares.filter((square) => square !== null).length;
        return movesCount % 2 === 0 ? 'X' : 'O';
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
                const userSymbol = user.id === currentGame.user1.id ? 'X' : 'O';
                if(squares[a] === userSymbol){
                    finishGame('winner', user.id);
                }
                return squares[a];
            }
        }
        return null;
    };

    const checkDraw = (squares: Player[]): boolean => {
        const isDraw = squares.every((cell) => cell !== null) && !calculateWinner(squares);

        if(isDraw){
            finishGame('draw', 0);
        }

        return isDraw;
    };

    const finishGame = async (resultGame: string, winner: number) => {
        try {
            const response = await fetch(`/games/${currentGame.id}/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ gameId: currentGame.id, resultGame, winner}),
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Erro ao enviar evento:", error);
        }
    };

    const winner = calculateWinner(squares);
    const isDraw = checkDraw(squares);
    const status = winner
        ? `Vencedor: ${winner}`
        : isDraw ? 'Empatou' : `Próximo jogador: ${calculateCurrentPlayer()}`;

        
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