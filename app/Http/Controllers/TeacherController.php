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
}
