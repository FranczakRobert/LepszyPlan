<?php

use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('schedules', [ScheduleController::class, 'index']);
Route::get('teachers/{id}', [\App\Http\Controllers\TeacherController::class, 'getById']);
