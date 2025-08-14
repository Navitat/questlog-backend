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

TBA
