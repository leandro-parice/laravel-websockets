<?php

namespace App\Http\Controllers;

use App\Models\Game;
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

    public function play($id)
    {
        $game = Game::with(['user1', 'user2'])->findOrFail($id);
        return Inertia::render('Game/Play', compact('game'));
    }
}
