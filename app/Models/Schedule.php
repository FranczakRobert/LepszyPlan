<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use hasFactory;

    protected $fillable = [
        'name', 'form', 'from', 'to', 'groupId', 'teacherId',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class, 'groupId');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacherId');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'roomId');
    }

}
