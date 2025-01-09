<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function getById($id)
    {
        $subject = Subject::findOrFail($id);
        return response()->json($subject);
    }

    public function getByName($name)
    {
        $subject = Subject::where('item', $name)->get();

        if ($subject->isEmpty()) {
            return response()->json(['message' => 'No subjects found with this name'], 404);
        }
        return response()->json($subject);
    }
}
