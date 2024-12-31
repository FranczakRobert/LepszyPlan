<?php

require_once 'Subject.php';
require_once 'Group.php';
require_once 'Room.php';

class Event {
    private int $id;
    private Subject $subject;
    private Group $group;
    private Room $room;
    private string $instructor;
    private DateTime $start;
    private DateTime $end;

    public function __construct(
        int $id,
        Subject $subject,
        Group $group,
        Room $room,
        string $instructor,
        DateTime $start,
        DateTime $end
    ) {
        $this->id = $id;
        $this->subject = $subject;
        $this->group = $group;
        $this->room = $room;
        $this->instructor = $instructor;
        $this->start = $start;
        $this->end = $end;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getSubject(): Subject {
        return $this->subject;
    }

    public function getGroup(): Group {
        return $this->group;
    }

    public function getRoom(): Room {
        return $this->room;
    }

    public function getInstructor(): string {
        return $this->instructor;
    }

    public function getStart(): DateTime {
        return $this->start;
    }

    public function getEnd(): DateTime {
        return $this->end;
    }

    public function setInstructor(string $instructor): void {
        $this->instructor = $instructor;
    }

    public function setStart(DateTime $start): void {
        $this->start = $start;
    }

    public function setEnd(DateTime $end): void {
        $this->end = $end;
    }
}