<?php

class Professor extends User {
    private string $title;

    public function __construct(int $id, string $firstName, string $lastName, array $favorites, string $title) {
        parent::__construct($id, $firstName, $lastName, $favorites);
        $this->title = $title;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function setTitle(string $title): void {
        $this->title = $title;
    }
}
