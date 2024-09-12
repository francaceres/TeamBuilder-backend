# TeamBuilder backend

This is the backend for the sports team management application TeamBuilder. The application allows for the creation and management of balanced teams for sports, with player profiles, match history, and other relevant details. The backend is built using NestJS, PostgreSQL as the database, and Prisma as the ORM.

## Features

- Group Creation: Create groups with many members and different roles to register matches and players.
- Player Management: Create, update, delete players, and manage their profiles.
- Match History: Save the history of wins, draws, and losses for teams.
- Balanced Team Generation: Create balanced teams based on player skills.
- Authentication and Authorization: Role and permission management using JWT and Passport.
- Pagination, Filtering, and Sorting: Support for optimized data queries through URLs.
- Group Management: Access control based on visualization settings (public or private) and authenticated user permissions.

## Requirements

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (v13 or higher)

## Installation

1. Clone this repository

```bash
$ git clone https://github.com/francaceres/TeamBuilder-backend
$ cd TeamBuilder-backend
```

2. Install dependencies:

```bash
$ npm install
```

3. Configure environment variables. Create a .env file in the root of the project with the following structure:
   `DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN="60m"
PORT=3000`

4. Run database migrations with Prisma:

```bash
$ npx prisma migrate dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The server will be running at http://localhost:3000 (or the port you set up in your .env).

## API Documentation

Complete API documentation is available at the /api/docs endpoint (generated with Swagger).

## Prisma

- Generate Prisma client:

```bash
$ npx prisma generate
```

- Run migrations

```bash
$ npx prisma migrate dev
```

- Explore the database with Prisma Studio:

```bash
$ npx prisma studio
```

## Credits

This whole project was created by Francisco Cáceres Ruiz ([LinkedIn](https://www.linkedin.com/in/francisco-caceres-ruiz/)).
