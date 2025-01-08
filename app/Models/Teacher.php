<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use hasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'surname'
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'teacherId');
    }
}
