## QuestLog Backend

REST API for the QuestLog app of the same author.
This Repo implements the backend, built in Express + MongoDB.

A repository for the front-end code can be found here: [front-end code](https://github.com/Navitat/questlog-frontend)

## Installation

To set up this back-end in your computer:

- Clone the repo: `git clone...`.
- Install dependencies: `npm install`.
- Create the following variables in an `.env` file at the root of the project:
  - PORT with the port where the server will be running: `PORT:YOUR_PORT`
  - ORIGIN with the location of the front-end app: `ORIGIN:http://my-cool-app.netlify.com`
  - TOKEN_SECRET to sign auth tokens: `TOKEN_SECRET:ilovepotatoes`.
- Run the app: `npm run dev`.

## Demo

A working demo of the app can be found here: [QuestLog](https://questlog-app.netlify.app/)

## API Endpoints

Authentication Routes (`/auth`)

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify JWT token
- `POST /auth/logout` - User logout

User Routes (`/api/user`)

- `GET /api/user` - Get user info
- `POST /api/user/disciplines` - Create disciplines
- `POST /api/user/sidequests` - Create Sidequests
- `PATCH /api/user/disciplines/:disciplineId/complete` - Complete Discipline
- `DELETE /api/user/discipline/:disciplineId` - Delete Discipline
- `PATCH /api/user/sidequests/:sidequestId/complete` - Complete Sidequest

Quest Routes (`/api/quests`)

- `GET /api/quests` - Get Quests
- `POST /api/quests` - Create Quest
- `POST /api/quests/:questId/tasks` - Create Task
- `POST /api/quests/:questId/inventory` - Create Inventory Item
- `PATCH /api/quests/:questId` - Update Quest Name
- `PATCH /api/quests/:questId/tasks/:taskId` - Complete Task of Quest
- `PATCH /api/quests/:questId/complete` - Complete quest
- `DETELE /api/quests/:questId` - Delete Quest
