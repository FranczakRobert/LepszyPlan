<?php

class Room {
    private int $id;
    private string $name;
    private string $building;

    public function __construct(int $id, string $name, string $building) {
        $this->id = $id;
        $this->name = $name;
        $this->building = $building;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getBuilding(): string {
        return $this->building;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function setBuilding(string $building): void {
        $this->building = $building;
    }
}
