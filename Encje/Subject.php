<?php

class Subject {
    public int $id;
    public string $name;
    public string $code;

    public function __construct(int $id, string $name, string $code) {
        $this->id = $id;
        $this->name = $name;
        $this->code = $code;
    }
}