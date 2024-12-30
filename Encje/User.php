<?php

class User {
    public int $id;
    public string $firstName;
    public string $lastName;
    public array $favorites;

    public function __construct(int $id, string $firstName, string $lastName, array $favorites) {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->favorites = $favorites;
    }
}