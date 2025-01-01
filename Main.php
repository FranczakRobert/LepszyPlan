<?php
require_once 'Web/ApiHandler.php';

class Main {
    public function run(): void {
        try {
            $apiHandler = new ApiHandler();
            $teachers = $apiHandler->getTeacher('Karczmar');
            echo "Nauczyciele:\n";
            if (is_array($teachers)) {
                foreach ($teachers as $teacher) {
                    if (isset($teacher['item'])) {
                        echo "- " . $teacher['item'] . "\n";
                    } else {
                        echo "- Brak danych dla nauczyciela.\n";
                    }
                }
            } else {
                echo "Brak wyników dla nauczycieli.\n";
            }

            $rooms = $apiHandler->getRoom('215');
            echo "\nSale:\n";
            if (is_array($rooms)) {
                foreach ($rooms as $room) {
                    if (isset($room['item'])) {
                        echo "- " . $room['item'] . "\n";
                    } else {
                        echo "- Brak danych dla sal.\n";
                    }
                }
            } else {
                echo "Brak wyników dla sal.\n";
            }

            $subjects = $apiHandler->getSubject('Aplikacje Internetowe');
            echo "\nPrzedmioty:\n";
            if (is_array($subjects)) {
                foreach ($subjects as $subject) {
                    if (isset($subject['item'])) {
                        echo "- " . $subject['item'] . "\n";
                    } else {
                        echo "- Brak danych dla przedmiotu.\n";
                    }
                }
            } else {
                echo "Brak wyników dla przedmiotów.\n";
            }

            $groups = $apiHandler->getGroup('S1_I');
            echo "\nGrupy:\n";
            if (is_array($groups)) {
                foreach ($groups as $group) {
                    if (isset($group['item'])) {
                        echo "- " . $group['item'] . "\n";
                    } else {
                        echo "- Brak danych dla grup.\n";
                    }
                }
            } else {
                echo "Brak wyników dla grup.\n";
            }

        } catch (Exception $e) {
            echo "Wystąpił błąd: " . $e->getMessage();
        }

        echo "Cmake dupa\n";
    }
}



$app = new Main();
$app->run();
