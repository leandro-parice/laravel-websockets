<?php

namespace App\Http\Controllers;

use App\Events\GameSquareClicked;
use App\Events\GameStatusUpdated;
use App\Models\Game;
use App\Models\Move;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        $activeGame = Game::where(function($query) use ($userId) {
            $query->where('user_1', $userId)
                ->orWhere('user_2', $userId);
        })->where('status', 'playing')->first();

        $canCreateGame = $activeGame === null;

        $games = Game::with(['user1', 'user2'])->orderBy('id', 'DESC')->get();
        return Inertia::render('Game/Index', compact('games', 'activeGame', 'canCreateGame'));
    }

    public function create()
    {
        $userId = Auth::id();
        
        $activeGame = Game::where(function ($query) use ($userId) {
            $query->where('user_1', $userId)
                  ->orWhere('user_2', $userId);
        })->where('status', 'playing')->first();

        if ($activeGame) {
            return redirect()->route('games')->withErrors(['Você já está participando de um jogo ativo.']);
        }

        $game = Game::create([
            'user_1' => $userId,
            'status' => 'waiting',
        ]);

        return redirect()->route('games.play', $game->id);
    }

    public function join($id)
    {
        $user = Auth::user();

        $status = 'playing';

        $game = Game::with(['user1', 'user2'])
            ->where('id', $id)
            ->whereNull('user_2')
            ->where('status', 'waiting')
            ->first();

        $game->user_2 = $user->id;
        $game->status = $status;
        $game->save();

        broadcast(new GameStatusUpdated($game, $status, $user));

        return redirect()->route('games.play', $game->id);
    }

    public function play($id)
    {
        $game = Game::with(['user1', 'user2', 'moves'])->findOrFail($id);
        return Inertia::render('Game/Play', compact('game'));
    }

    public function squareClick(Request $request, $id)
    {
        $order = intval($request->order);
        $user = Auth::user();
        $game = Game::with(['user1', 'user2'])->findOrFail($id);

        $move = Move::create([
            'game_id' => $game->id,
            'user_id' => $user->id,
            'position' => $order,
        ]);

        broadcast(new GameSquareClicked($game, $user, $order));

        return response()->json(['status' => 'event broadcasted']);
    }

    public function finishGame(Request $request)
    {
        $gameId = $request->gameId;
        $resultGame = $request->resultGame;
        $winner = $request->winner;

        $game = Game::findOrFail($gameId);
        $game->status = 'finished';
        $game->result = $resultGame;
        $game->winner_id = $winner;
        $game->save();

        return response()->json(['status' => 'game saved']);
    }
}
