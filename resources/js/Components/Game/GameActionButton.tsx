import { Link } from '@inertiajs/react';
import { Game } from "@/types/interfaces";

interface Props {
    game: Game;
    activeGame: Game | null;
}

const GameActionButton: React.FC<Props> = ({ game, activeGame }) => {
    if (game.status === 'playing') {
        if (activeGame && activeGame.id === game.id) {
            return (
                <Link
                    href={`/games/${game.id}/play`}
                    className="text-blue-500 hover:underline"
                    aria-label={`Voltar a jogar`}
                >
                    Voltar a jogar
                </Link>
            );
        } else {
            return (
                <Link
                    href={`/games/${game.id}/play`}
                    className="text-blue-500 hover:underline"
                    aria-label={`Assistir`}
                >
                    Assistir
                </Link>
            );
        }
    } else if (game.status === 'waiting' && !activeGame) {
        return (
            <Link
                href={`/games/${game.id}/join`}
                className="text-blue-500 hover:underline"
                aria-label={`Entrar no jogo`}
            >
                Entrar no jogo
            </Link>
        );
    } else if (game.status === 'finished') {
        return (
            <Link
                href={`/games/${game.id}/play`}
                className="text-blue-500 hover:underline"
                aria-label={`Ver como foi o jogo`}
            >
                Ver como foi o jogo
            </Link>
        );
    }
    return null;
};

export default GameActionButton;