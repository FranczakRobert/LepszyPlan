<?php

namespace App\Http\Controllers;

use App\Http\Services\TeacherServiceDB;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{

    private $teacherServiceDB;

    public function __construct(TeacherServiceDB $teacherServiceDB)
    {
        $this->teacherServiceDB = $teacherServiceDB;
    }

    public function getById($id)
    {
        return $this->teacherServiceDB->getById($id);
    }

    public function getByName($name)
    {
        return $this->teacherServiceDB->getByName($name);
    }

    public function getBySurname($surname)
    {
        return $this->teacherServiceDB->getBySurname($surname);
    }

}
