<?php

namespace App\Console\Commands;

use App\Models\Subject;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImportSubjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:subjects';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and populate subject data from an external API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Http::get('https://plan.zut.edu.pl/schedule.php?kind=subject');

        if ($response->failed()) {
            $this->error('Failed to fetch data from the API.');
            return 1;
        }

        preg_match('/\[[\s\S]*\]/', $response->body(), $matches);

        if (isset($matches[0])) {
            $jsonData = json_decode($matches[0], true);

            if (json_last_error() === JSON_ERROR_NONE) {
                foreach ($jsonData as $subjectData) {
                    if (isset($subjectData['item'])) {
                        $subjectName = $subjectData['item'];

                        Subject::updateOrCreate(
                            ['name' => $subjectName]
                        );
                    }
                }

                $this->info('Subjects imported successfully!');
                return 0;
            } else {
                Log::error('JSON decoding failed: ' . json_last_error_msg());
                $this->error('JSON decoding failed.');
                return 2;
            }
        } else {
            Log::error('No JSON found in the API response.');
            $this->error('No JSON found in the API response.');
            return 3;
        }
    }
}
