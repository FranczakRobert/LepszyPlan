<?php

namespace App\Console\Commands;

use App\Models\Room; // Assuming you have a Room model similar to the Teacher model
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportRooms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:rooms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and populate rooms data from an external API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $response = Http::get('https://plan.zut.edu.pl/schedule.php?kind=room');

        if ($response->failed()) {
            $this->error('Failed to fetch data from the API.');
            return 1;
        }

        preg_match('/\[[\s\S]*\]/', $response->body(), $matches);

        if (isset($matches[0])) {
            $jsonData = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                foreach ($jsonData as $roomData) {
                    if (isset($roomData['item'])) {

                        $roomName = $roomData['item'];

                        Room::updateOrCreate(
                            ['name' => $roomName]
                        );
                    }
                }
                $this->info('Rooms imported successfully!');
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
