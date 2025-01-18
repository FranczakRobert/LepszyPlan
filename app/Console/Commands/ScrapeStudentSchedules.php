<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ScrapeStudentSchedules extends Command
{
    protected $signature = 'scrape:student-schedules';
    protected $description = 'Scrapes the student schedules from the API for student IDs ranging from 1 to 99999';

    public function handle(): int
    {
        $baseUrl = 'https://plan.zut.edu.pl/schedule_student.php';
        $startDate = '2024-09-30T00%3A00%3A00%2B01%3A00';
        $endDate = '2025-09-30T00%3A00%3A00%2B01%3A00';

        for ($studentId = 1; $studentId <= 99999; $studentId++) {
            $this->info("Processing student ID: $studentId");

            $response = Http::get($baseUrl, [
                'number' => $studentId,
                'start' => $startDate,
                'end' => $endDate,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($this->hasValidData($data)) {
                    \DB::table('students')->insertOrIgnore([
                        'id' => $studentId,
                    ]);
                    foreach ($data as $item) {
                        if (!empty($item)) {
                            $groupName = $item['group_name'] ?? null;

                            if ($groupName) {
                                $groupId = \DB::table('groups')
                                    ->where('name', 'like', $groupName)
                                    ->value('id');

                                if ($groupId) {
                                    $this->insertStudentGroupRelation($studentId, $groupId);
                                    $this->info("Linked student ID: $studentId to group ID: $groupId");
                                } else {
                                    $this->warn("No matching group found for group name: $groupName");
                                }
                            }
                        }
                    }
                } else {
                    $this->info("No valid data for student ID: $studentId");
                }
            } else {
                $this->error("Failed to fetch data for student ID: $studentId");
            }
        }

        return 0;
    }

    private function hasValidData(array $data): bool
    {
        // Return false if the data is empty or only contains an empty array
        return !empty($data) && !(count($data) === 1 && empty($data[0]));
    }

    private function insertStudentGroupRelation(int $studentId, int $groupId): void
    {
        \DB::table('group_student')->insertOrIgnore([
            'studentId' => $studentId,
            'groupId' => $groupId,
        ]);
    }
}
