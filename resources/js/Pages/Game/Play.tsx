import Board from "@/Components/Game/Board";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Game, User } from "@/types/interfaces";

interface Props {
    game: Game;
}

interface GameStatusUpdatedInterface {
    game: Game;
}



const GamePlay: React.FC<Props> = ({game}) => {
    const [currentGame, setCurrentGame] = useState(game);

    useEffect(() => {
        const channel = window.Echo.channel(`game.${game.id}`);
        channel.listen('GameStatusUpdated', (event: GameStatusUpdatedInterface) => {
            setCurrentGame(event.game);
        });

        return () => {
            channel.stopListening('GameStatusUpdated');
        };
    }, [game]);

    return (
        <Authenticated 
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Jogar
                </h2>
            }>
            <Head title="Jogar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <p>{currentGame.user1.name} x {currentGame.user2 ? currentGame.user2.name : 'Aguardando adversário'}</p>
                            <Board game={game} />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default GamePlay;