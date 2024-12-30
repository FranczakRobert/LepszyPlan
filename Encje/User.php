<?php

abstract class User {
    private int $id;
    private string $firstName;
    private string $lastName;
    private array $favorites;

    public function __construct(int $id, string $firstName, string $lastName, array $favorites) {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->favorites = $favorites;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getFirstName(): string {
        return $this->firstName;
    }

    public function getLastName(): string {
        return $this->lastName;
    }

    public function getFavorites(): array {
        return $this->favorites;
    }

    public function setFirstName(string $firstName): void {
        $this->firstName = $firstName;
    }

    public function setLastName(string $lastName): void {
        $this->lastName = $lastName;
    }

    public function setFavorites(array $favorites): void {
        $this->favorites = $favorites;
    }
}