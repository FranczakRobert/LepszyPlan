<?php

class ApiHandler {
    private string $baseUrl;

    public function __construct() {
        $this->baseUrl = rtrim("https://plan.zut.edu.pl", '/');
    }

    /**
     * API GET na Zut
     *
     * @param string $endpoint Endpoint
     * @param string $query Parametr zapytania
     * @return array wynik zapytania.
     * @throws Exception Jeśli żądanie się nie powiedzie.
     */
    private function sendRequest(string $endpoint, string $query): array {
        $url = "{$this->baseUrl}/schedule.php?kind={$endpoint}&query=" . urlencode($query);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        if ($httpCode !== 200 || $response === false) {
            throw new Exception("Błąd podczas wysyłania zapytania do API: {$url}");
        }

        return json_decode($response, true) ?? [];
    }

    /**
     * Pobiera dane nauczyciela na podstawie zapytania.
     *
     * @param string $query Część nazwy nauczyciela. Nie potrzeba całej.
     * @return array Wynik w formie tablicy asocjacyjnej.
     */
    public function getTeacher(string $query): array {
        return $this->sendRequest('teacher', $query);
    }

    /**
     * Pobiera dane sali na podstawie zapytania.
     *
     * @param string $query Część nazwy lub kodu sali. Nie potrzeba całej.
     * @return array Wynik w formie tablicy asocjacyjnej.
     */
    public function getRoom(string $query): array {
        return $this->sendRequest('room', $query);
    }

    /**
     * Pobiera dane przedmiotu na podstawie zapytania.
     *
     * @param string $query Część nazwy przedmiotu. Nie potrzeba całej.
     * @return array Wynik w formie tablicy asocjacyjnej.
     */
    public function getSubject(string $query): array {
        return $this->sendRequest('subject', $query);
    }

    /**
     * Pobiera dane grupy na podstawie zapytania.
     *
     * @param string $query Część nazwy grupy.
     * @return array Wynik w formie tablicy asocjacyjnej.
     */
    public function getGroup(string $query): array {
        return $this->sendRequest('group', $query);
    }
}
