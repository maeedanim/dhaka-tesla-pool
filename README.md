# Dhaka Tesla Pool

A ride-pooling MVP for Dhaka's informal battery-powered "Tesla" vehicles.

## Story

- Jashim — driver
- Bullet — 3-seat battery-powered Tesla
- Nusrat — passenger, Banani → Mohakhali
- Rafiq — passenger, Banani → Gulshan 1
- Shirin — passenger involved in the last-seat concurrency scenario

## Technology

- Backend: Node.js + TypeScript + NestJS
- Frontend: Next.js App Router + TypeScript
- Database: PostgreSQL
- Database access: Knex.js + pg
- Authentication: JWT + Passport + bcrypt
- Validation: class-validator + class-transformer
- Testing: Jest
- Containerization: Docker + Docker Compose

## Architecture


```mermaid

flowchart LR

&#x20;   B\[Browser]



&#x20;   F\[Next.js App Router<br/>React + TypeScript]



&#x20;   A\[NestJS API<br/>Node.js + TypeScript]



&#x20;   D\[(PostgreSQL)]



&#x20;   B -->|HTTP / JSON| F

&#x20;   F -->|REST API / JSON| A

&#x20;   A -->|SQL via Knex.js + pg| D



## Development Status

Phase 1 — Project Initialization & Architecture

In progress.