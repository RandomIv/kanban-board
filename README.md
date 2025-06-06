# 🗂️ Kanban Board

Цей додаток допомагає ефективно організовувати робочі процеси та забезпечує зручний візуальний контроль за виконанням завдань. Завдяки інтуїтивному інтерфейсу та продуманій архітектурі він стане надійним помічником у щоденній роботі.

Повноцінний Kanban-додаток з бекендом на NestJS, фронтендом на Next.js та базою даних PostgreSQL. Усі сервіси контейнеризовані за допомогою Docker для зручного розгортання та стабільної роботи.

📄 Детальніше можна ознайомитися [тут](https://drive.google.com/file/d/1lZp22OFRO0y8NkiLO7UQv7TXScBntG2b/view)

---

## ⚙️ Стек технологій

- 🧠 **Frontend**: Next.js + TypeScript
- 🚀 **Backend**: NestJS + TypeScript
- 🛢️ **Database**: PostgreSQL
- 📚 **ORM**: Prisma
- 🐳 **Containerization**: Docker + Docker Compose

---

## 📁 Структура проекту

```

kanban-board/
├── api/                      # NestJS backend
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
│
├── client/                   # Next.js frontend
│   ├── src/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md

````

---

## 🚀 Швидкий старт

> Переконайтесь, що встановлено `Docker` та `Docker Compose`.

### 1. Клонувати репозиторій

```bash
git clone https://github.com/RandomIv/kanban-board.git
cd kanban-board
````

### 2. Створити `.env` файли з шаблонів
### 📂 `api/.env`

```env
PORT=

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

JWT_SECRET=
JWT_EXPIRATION=
```

---

### 📂 `client/.env`

```env
NEXT_PUBLIC_API_URL=
```


---


🔐 Внесіть свої значення у `.env` файли.

### 3. Запустити проєкт

```bash
docker-compose up --build
```

✅ Prisma автоматично застосує всі міграції при запуску `api`.

---

## 🔗 URL-адреси за замовчуванням

| Сервіс                    | URL                                            |
| ------------------------- | ---------------------------------------------- |
| 🖥️ Frontend (Next.js)    | [http://localhost:3000](http://localhost:3000) |
| 🔌 Backend (NestJS API)   | [http://localhost:5006](http://localhost:5006) |
| 🛢️ PostgreSQL (в docker) | localhost:5432                                 |

---


## 🧠 Prisma (ручне використання при потребі)

> Виконується у контейнері `api`.

### 🔄 Генерація клієнта

```bash
docker-compose exec api npx prisma generate
```

### 🛠️ Створення міграції

```bash
docker-compose exec api npx prisma migrate dev --name init
```

### 🌱 Відкриття Prisma Studio

```bash
docker-compose exec api npx prisma studio
```
