<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function getById($id)
    {
        $teacher = Teacher::findOrFail($id);
        return response()->json($teacher);
    }
    
    public function getByName($name)
    {
        $teachers = Teacher::where('name', $name)->get();

        if ($teachers->isEmpty()) {
            return response()->json(['message' => 'No teachers found with this name'], 404);
        }
        return response()->json($teachers);
    }

    public function getBySurname($surname)
    {
        $teachers = Teacher::where('surname', $surname)->get();

        if ($teachers->isEmpty()) {
            return response()->json(['message' => 'No teachers found with this surename'], 404);
        }
        return response()->json($teachers);
    }

}
