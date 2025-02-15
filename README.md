# Quoi regarder?

## Description

This is a web application that helps you find movies and TV shows to watch. It uses
the [TMDb API](https://www.themoviedb.org/documentation/api) to fetch data.

## Introduction

This project is built with [Nuxt.js](https://nuxtjs.org/), a Vue.js framework. It
uses [Tailwind CSS](https://tailwindcss.com/) and an Adonis.js backend [Adonis.js](https://adonisjs.com/).

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

### Command to push to main branch

```bash
git checkout main
git pull --rebase origin develop
git push origin main

git checkout develop
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
