<?php

namespace App\Console\Commands;

use App\Models\Group;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportSchedules extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:schedules';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports schedules from the ZUT API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $teachers = Teacher::all();

        if ($teachers->isEmpty()) {
            $this->info('No teachers found in the database.');
            return;
        }

        foreach($teachers as $teacher) {
            $apiUrl = sprintf(
                'https://plan.zut.edu.pl/schedule_student.php?teacher=%s%%20%s&start=2024-09-30T00%%3A00%%3A00%%2B02%%3A00&end=2025-09-29T00%%3A00%%3A00%%2B02%%3A00',
                urlencode($teacher->surname),
                urlencode($teacher->name)
            );
            $this->info("Fetching data for: {$teacher->surname} {$teacher->name}");

            try {
                $response = Http::get($apiUrl);

                if ($response->ok()) {
                    $data = $response->json();

                    if (empty($data) || (is_array($data) && count($data) === 1 && empty($data[0]))) {
                        $this->info("No schedule data found for: {$teacher->surname} {$teacher->name}");
                        continue;
                    }

                    foreach ($data as $lesson) {
                        if (empty($lesson) || empty($lesson['lesson_form_short']) || empty($lesson['start']) || empty($lesson['end'])) {
                            continue;
                        }
                        $subject = Subject::firstOrCreate(['name' => $lesson['subject']]);
                        $subjectId = $subject->id;

                        $group = Group::firstOrCreate(['name' => $lesson['group_name']]);
                        $groupId = $group->id;

                        $workerParts = explode(' ', $lesson['worker']);
                        $surname = $workerParts[0];
                        $name = $workerParts[1] ?? '';
                        $teacher = Teacher::firstOrCreate(
                            ['surname' => $surname, 'name' => $name],
                            ['surname' => $surname, 'name' => $name]
                        );
                        $teacherId = $teacher->id;

                        $room = Room::firstOrCreate(['name' => $lesson['room']]);
                        $roomId = $room->id;

                        $schedule = Schedule::create([
                            'form' => $lesson['lesson_form_short'],
                            'from' => $lesson['start'],
                            'to' => $lesson['end'],
                            'subjectId' => $subjectId,
                            'groupId' => $groupId,
                            'teacherId' => $teacherId,
                            'roomId' => $roomId,
                        ]);

                        $this->info("Added schedule for lesson: {$lesson['subject']} | Teacher: {$lesson['worker']} | Room: {$lesson['room']}");
                    }
                } else {
                    $this->error("Failed to fetch data for: {$teacher->surname} {$teacher->name}");
                }
            } catch (\Exception $e) {
                $this->error("Error for {$teacher->surname} {$teacher->name}: " . $e->getMessage());
            }
        }
        $this->info('Finished processing all teachers.');
    }
}
