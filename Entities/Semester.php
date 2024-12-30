<?php

class Semester {
    private int $id;
    private string $name;
    private DateTime $start;
    private DateTime $end;

    public function __construct(int $id, string $name, DateTime $start, DateTime $end) {
        $this->id = $id;
        $this->name = $name;
        $this->start = $start;
        $this->end = $end;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getStart(): DateTime {
        return $this->start;
    }

    public function getEnd(): DateTime {
        return $this->end;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function setStart(DateTime $start): void {
        $this->start = $start;
    }

    public function setEnd(DateTime $end): void {
        $this->end = $end;
    }
}