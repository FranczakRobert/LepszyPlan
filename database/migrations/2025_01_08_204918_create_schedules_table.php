<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->char('form', 1);
            $table->date('from');
            $table->date('to');

            $table->foreignId('groupId')->constrained('groups');
            $table->foreignId('teacherId')->constrained('teachers');
            $table->foreignId('roomId')->constrained('rooms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
