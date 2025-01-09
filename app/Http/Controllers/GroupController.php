<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function getById($id)
    {
        $group = Group::findOrFail($id);
        return response()->json($group);
    }

    public function getByName($name)
    {
        $group = Group::where('name', $name)->get();

        if ($group->isEmpty()) {
            return response()->json(['message' => 'No groups found with this name'], 404);
        }
        return response()->json($group);
    }
}
