# Quoi regarder?

## Description

This is a web application that helps you find movies and TV shows to watch. It uses
the [TMDb API](https://www.themoviedb.org/documentation/api) to fetch data.

## Introduction

This project is built with [Nuxt.js](https://nuxtjs.org/), a Vue.js framework. It
uses [Tailwind CSS](https://tailwindcss.com/) and an Spring Boot API.

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## New Version

- First, you need to checkout to the main branch

```bash
git checkout main
```

- Then, you need to pull the latest changes from the develop branch

```bash
git pull --rebase origin develop
```

- After that, you need to merge the develop branch into the main branch

```bash
git push origin +main
```

- Finally, you can run the npm command to release a new version

```bash
npm run tag:patch # For a patch version
npm run tag:minor # For a minor version
npm run tag:major # For a major version
```

- Now, you can rebase the develop branch

```bash
git checkout develop
git pull --rebase origin main
git push origin +develop
```

## Environment Variables

Create a `.env` file in the root of the project matching the `.env.example` file. Fill in the values with your own API
key and base URL.

## Husky

This project uses [Husky](https://typicode.github.io/husky) to run linting and formatting checks before committing
changes. Make sure to install dependencies before committing:

```bash
npm install
```

Lint and format your code:

```bash
npm run lint
```
