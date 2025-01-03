import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Game } from "@/types/interfaces";

interface Props {
    games: Game[];
    activeGame: Game | null;
    canCreateGame: boolean;
}

const GameIndex: React.FC<Props> = ({ games, activeGame, canCreateGame }) => {
    const renderButton = (game: Game) => {
        if (game.status === 'playing') {
            if(activeGame && activeGame.id === game.id){
                return (
                    <Link href={`/games/${game.id}/play`} className="text-blue-500 hover:underline">Voltar a jogar</Link>
                );
            }else{
                return (
                    <Link href={`/games/${game.id}/play`} className="text-blue-500 hover:underline">Assistir</Link>
                );
            }
        } else if (game.status === 'waiting' && !activeGame) {
            return (
                <Link href={`/games/${game.id}/join`} className="text-blue-500 hover:underline">Entrar no jogo</Link>
            );
        } else if (game.status === 'finished') {
            return (
                <Link href={`/games/${game.id}/play`} className="text-blue-500 hover:underline">Ver como foi o jogo</Link>
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Jogos
                </h2>
            }
        >
            <Head title="Jogos" />
             
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-2xl font-bold mb-6">Lista de Jogos</h1>
                            <div className="overflow-x-auto">

                            {activeGame && (
                            <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                                Você já está participando de um jogo em andamento (ID: {activeGame.id}). 
                                Conclua este jogo antes de criar ou entrar em outro.
                            </div>
                        )}

                        {canCreateGame && (
                            <div className="mb-6">
                                <Link
                                    href="/games/create"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block"
                                >
                                    Criar Novo Jogo
                                </Link>
                            </div>
                        )}

                                <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-700">
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">ID</th>
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">Player 1</th>
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">Player 2</th>
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">Status</th>
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">Criado Em</th>
                                            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">Jogar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {games.length > 0 ? (
                                            games.map((game) => (
                                                <tr key={game.id} className="even:bg-gray-100 dark:even:bg-gray-700">
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{game.id}</td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{game.user1.name}</td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{game.user2 ? game.user2.name : '-'}</td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{game.status}</td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{new Date(game.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">{renderButton(game)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center"
                                                >
                                                    Nenhum jogo encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default GameIndex;