# 🗂️ Kanban Board

Цей додаток допомагає ефективно організовувати робочі процеси та забезпечує зручний візуальний контроль за виконанням завдань. Завдяки інтуїтивному інтерфейсу та продуманій архітектурі він стане надійним помічником у щоденній роботі.
Повноцінний Kanban-додаток з бекендом на NestJS, фронтендом на Next.js та базою даних PostgreSQL. Усі сервіси контейнеризовані за допомогою Docker для зручного розгортання та стабільної роботи.
### Детальніше можна ознайомитися [тут](https://drive.google.com/file/d/1lZp22OFRO0y8NkiLO7UQv7TXScBntG2b/view)

---

## ⚙️ Стек технологій

- 🧠 **Frontend**: Next.js + TypeScript
- 🚀 **Backend**: NestJS + TypeScript
- 🛢️ **Database**: PostgreSQL
- 📚 **ORM**: Prisma
- 🐳 **Docker**: для всіх сервісів

---

## 📁 Структура проекту

```
kanban-board/
├── api/                    # NestJS backend
│   ├── Dockerfile
│   └── prisma/
│       └── schema.prisma
├── client/                 # Next.js frontend
│   ├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Швидкий старт

> Переконайтеся, що встановлено Docker та Docker Compose.

### 1. Клонування репозиторію

```bash
git clone https://github.com/RandomIv/kanban-board.git
cd kanban-board
```

### 2. Запуск

```bash
docker-compose up --build
```

### 3. Міграція (тільки для першого запуску)

```bash
docker-compose exec api npx prisma migrate deploy
```

---

## 🔗 URL-адреси

- 🖥️ **Frontend (Next.js)**: http://localhost:3000
- 🔌 **Backend (NestJS API)**: http://localhost:5000
- 🛢️ **PostgreSQL**: доступний на `localhost:5432`

---

## ⚙️ Змінні середовища

Файл `docker-compose.yml` вже містить усі змінні:

| Назва | Значення |
|-------|----------|
| `POSTGRES_DB` | `nestjs_db` |
| `POSTGRES_USER` | `nestjs_user` |
| `POSTGRES_PASSWORD` | `password_secure` |
| `DATABASE_URL` | `postgresql://nestjs_user:password_secure@db:5432/nestjs_db` |

---

## 🧠 Prisma (корисні команди)

Виконуються всередині контейнера `api`:

### 🔄 Генерація клієнта

```bash
docker-compose exec api npx prisma generate
```

### 🛠️ Створення міграції

```bash
docker-compose exec api npx prisma migrate dev --name init
```

### 📊 Prisma Studio

```bash
docker-compose exec api npx prisma studio
```

---

## 📄 Ліцензія

MIT License © 2025 RandomIv

---

## 🙋 Підтримка

Якщо маєте питання чи пропозиції — створіть Issue.
