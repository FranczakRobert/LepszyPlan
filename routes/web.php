<?php

use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('schedules', [ScheduleController::class, 'index']);

//GROUPS
Route::get('group/id/{id}', [\App\Http\Controllers\GroupController::class, 'getById']);
Route::get('group/name/{name}', [\App\Http\Controllers\GroupController::class, 'getByName']);

//ROOMS
Route::get('rooms/id/{id}', [\App\Http\Controllers\RoomController::class, 'getById']);

//TEACHERS
Route::get('teachers/id/{id}', [\App\Http\Controllers\TeacherController::class, 'getById']);
Route::get('teachers/name/{name}', [\App\Http\Controllers\TeacherController::class, 'getByName']);
Route::get('teachers/surname/{surname}', [\App\Http\Controllers\TeacherController::class, 'getBySurname']);
