<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/games', [GameController::class, 'index'])->middleware(['auth', 'verified'])->name('games');
Route::get('/games/create', [GameController::class, 'create'])->name('games.create');
Route::get('/games/{id}/join', [GameController::class, 'join'])->name('games.join');
Route::get('/games/{id}/play', [GameController::class, 'play'])->middleware(['auth', 'verified'])->name('games.play');
Route::post('/games/{id}/square-click', [GameController::class, 'squareClick'])->middleware(['auth', 'verified'])->name('games.square.click');

// Route::get('/test', [TestController::class, 'index'])->middleware(['auth', 'verified'])->name('test.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
