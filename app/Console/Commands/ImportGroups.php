<?php

namespace App\Console\Commands;

use App\Models\Group;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportGroups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:groups';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and populate group data from an external API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Http::get('https://plan.zut.edu.pl/schedule.php?kind=group');

        if ($response->failed()) {
            $this->error('Failed to fetch data from the API.');
            return 1;
        }

        preg_match('/\[[\s\S]*\]/', $response->body(), $matches);

        if (isset($matches[0])) {
            $jsonData = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                foreach ($jsonData as $groupData) {
                    if (isset($groupData['item'])) {
                        $groupName = $groupData['item'];

                        // Utworzenie lub zaktualizowanie grupy w bazie danych
                        Group::updateOrCreate(
                            ['name' => $groupName] // Zapytanie używające nazwy grupy jako klucza unikalnego
                        );
                    }
                }
                $this->info('Groups imported successfully!');
                return 0;
            } else {
                \Log::error('JSON decoding failed: ' . json_last_error_msg());
                return 2;
            }
        } else {
            \Log::error('No JSON found in the API response.');
            return 3;
        }
    }
}
