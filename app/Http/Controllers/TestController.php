<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $receiverId = $user->id == 1 ? 2 : 1;

        broadcast(new MessageSent('feito jogada', $receiverId));
        return 'ok';
    }
}
