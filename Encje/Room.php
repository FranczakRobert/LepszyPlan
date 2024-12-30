<?php

class Room {
    public int $id;
    public string $name;
    public string $building;

    public function __construct(int $id, string $name, string $building) {
        $this->id = $id;
        $this->name = $name;
        $this->building = $building;
    }
}