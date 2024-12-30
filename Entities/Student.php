<?php

class Student extends User {
    private int $studentNumber;

    public function __construct(int $id, string $firstName, string $lastName, array $favorites, int $studentNumber) {
        parent::__construct($id, $firstName, $lastName, $favorites);
        $this->studentNumber = $studentNumber;
    }

    public function getStudentNumber(): int {
        return $this->studentNumber;
    }

    public function setStudentNumber(int $studentNumber): void {
        $this->studentNumber = $studentNumber;
    }
}