<?php

class ApiConfig {
    private string $baseUrl;
    private string $apiKey;
    private array $endpoints;

    public function __construct(string $baseUrl, string $apiKey, array $endpoints) {
        $this->baseUrl = $baseUrl;
        $this->apiKey = $apiKey;
        $this->endpoints = $endpoints;
    }

    public function getBaseUrl(): string {
        return $this->baseUrl;
    }

    public function getApiKey(): string {
        return $this->apiKey;
    }

    public function getEndpoints(): array {
        return $this->endpoints;
    }

    public function setBaseUrl(string $baseUrl): void {
        $this->baseUrl = $baseUrl;
    }

    public function setApiKey(string $apiKey): void {
        $this->apiKey = $apiKey;
    }

    public function setEndpoints(array $endpoints): void {
        $this->endpoints = $endpoints;
    }
}