\# Dhaka Tesla Pool — Architecture



\## System Architecture



```mermaid

flowchart LR

&#x20;   B\[Browser]



&#x20;   F\[Next.js App Router<br/>React + TypeScript]



&#x20;   A\[NestJS API<br/>Node.js + TypeScript]



&#x20;   D\[(PostgreSQL)]



&#x20;   B -->|HTTP / JSON| F

&#x20;   F -->|REST API / JSON| A

&#x20;   A -->|SQL via Knex.js + pg| D

