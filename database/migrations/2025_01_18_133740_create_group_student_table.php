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
        Schema::create('group_student', function (Blueprint $table) {
            $table->unsignedInteger('studentId');
            $table->unsignedBigInteger('groupId');

            $table->primary(['studentId', 'groupId']);
            $table->foreign('studentId')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('groupId')->references('id')->on('groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_student');
    }
};
