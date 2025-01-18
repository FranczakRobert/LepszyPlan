<?php

namespace App\Http\Controllers;

use App\Http\Services\TeacherServiceDB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestController extends Controller
{
    private $teacherServiceDB;

    public function __construct(TeacherServiceDB $teacherServiceDB)
    {
        $this->teacherServiceDB = $teacherServiceDB;
    }

    public function generatePlan(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'teachers' => 'nullable|array',
            'teachers.*' => 'string',
            'subjects' => 'nullable|array',
            'subjects.*' => 'string',
            'groups' => 'nullable|array',
            'groups.*' => 'string',
            'rooms' => 'nullable|array',
            'rooms.*' => 'string',
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        return $this->generateResponse($validated);
    }

    public function generatePlanFromUrl(Request $request): \Illuminate\Http\JsonResponse
    {
        $subjects = $request->query('subjects');
        $teachers = $request->query('teachers');
        $groups = $request->query('groups');
        $rooms = $request->query('rooms');
        $from = $request->query('from');
        $to = $request->query('to');

        $validated = $request->validate([
            'teachers' => 'nullable',
            'subjects' => 'nullable',
            'groups' => 'nullable',
            'rooms' => 'nullable',
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $validated['teachers'] = is_string($teachers) ? explode(',', $teachers) : $teachers;
        $validated['subjects'] = is_string($subjects) ? explode(',', $subjects) : $subjects;
        $validated['groups'] = is_string($groups) ? explode(',', $groups) : $groups;
        $validated['rooms'] = is_string($rooms) ? explode(',', $rooms) : $rooms;

        return $this->generateResponse($validated);
    }

    public function generateResponse(array $validated): \Illuminate\Http\JsonResponse
    {
        $query = DB::table('schedules')
            ->join('subjects', 'schedules.subjectId', '=', 'subjects.id')
            ->join('teachers', 'schedules.teacherId', '=', 'teachers.id')
            ->join('groups', 'schedules.groupId', '=', 'groups.id')
            ->join('rooms', 'schedules.roomId', '=', 'rooms.id')
            ->select(
                'schedules.from',
                'schedules.to',
                'subjects.name as subjectName',
                DB::raw("teachers.name || ' ' || teachers.surname as teacher"),
                'rooms.name as roomName'
            )
            ->whereBetween('schedules.from', [$validated['from'], $validated['to']]);

        if (!empty($validated['teachers'])) {
            $query->whereIn(DB::raw("teachers.name || ' ' || teachers.surname"), $validated['teachers']);
        }

        if (!empty($validated['subjects'])) {
            $query->whereIn('subjects.name', $validated['subjects']);
        }

        if (!empty($validated['groups'])) {
            $query->whereIn('groups.name', $validated['groups']);
        }

        if (!empty($validated['rooms'])) {
            $query->whereIn('rooms.name', $validated['rooms']);
        }

        $result = $query->get();
        return response()->json($result);
    }
}
