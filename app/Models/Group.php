<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use hasFactory;

    protected $fillable = [
        'name',
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'groupId');
    }
}
