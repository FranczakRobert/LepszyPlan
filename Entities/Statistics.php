<?php

class Statistics {
    private int $id;
    private int $totalHours;
    private int $totalEvents;
    private int $totalRooms;

    public function __construct(int $id, int $totalHours, int $totalEvents, int $totalRooms) {
        $this->id = $id;
        $this->totalHours = $totalHours;
        $this->totalEvents = $totalEvents;
        $this->totalRooms = $totalRooms;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getTotalHours(): int {
        return $this->totalHours;
    }

    public function getTotalEvents(): int {
        return $this->totalEvents;
    }

    public function getTotalRooms(): int {
        return $this->totalRooms;
    }

    public function setTotalHours(int $totalHours): void {
        $this->totalHours = $totalHours;
    }

    public function setTotalEvents(int $totalEvents): void {
        $this->totalEvents = $totalEvents;
    }

    public function setTotalRooms(int $totalRooms): void {
        $this->totalRooms = $totalRooms;
    }
}