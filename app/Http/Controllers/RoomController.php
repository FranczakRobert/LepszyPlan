<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function getById($id)
    {
        $room = Room::findOrFail($id);
        return response()->json($room);
    }

    public function getByName($name)
    {
        $room = Room::where('item', $name)->get();

        if ($room->isEmpty()) {
            return response()->json(['message' => 'No rooms found with this name'], 404);
        }
        return response()->json($room);
    }
}
