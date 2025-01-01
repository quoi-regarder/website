# Quoi regarder?

## Description

This is a web application that helps you find movies and TV shows to watch. It uses
the [TMDb API](https://www.themoviedb.org/documentation/api) to fetch data.

## Introduction

This project is built with [Nuxt.js](https://nuxtjs.org/), a Vue.js framework. It
uses [Tailwind CSS](https://tailwindcss.com/) and a self-hosted [Supabase](https://supabase.io/) instance for user
authentication and data storage.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Deploy to Vercel

This project is set up to be deployed to [Vercel](https://vercel.com/).

### Command to push to main branch

```bash
git checkout main
git pull --rebase origin develop
git push origin main

git checkout develop
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Environment Variables

Create a `.env` file in the root of the project matching the `.env.example` file. Fill in the values with your own API
key and base URL.

## Husky

This project uses [Husky](https://typicode.github.io/husky) to run linting and formatting checks before committing
changes. Make sure to install dependencies before committing:

```bash
pnpm install
```

Lint and format your code:

```bash
pnpm lint
```

## Supabase

This project uses a self-hosted Supabase instance for user authentication and data storage. You can access the Supabase
dashboard at [supastudio.quoi-regarder.fr](https://supastudio.quoi-regarder.fr/).

### Migration

#### Install the CLI

```bash
pnpm install -g supabase
```

#### Pull migrations

```bash
supabase db pull --db-url "postgres://[user].[tenant-id]:[password]@[ip]:[port]/[db-name]"
```

#### Push migrations

```bash
supabase db push --db-url "postgres://[user].[tenant-id]:[password]@[ip]:[port]/[db-name]"
```

#### Reset migration

```bash
supabase db reset --db-url "postgres://[user].[tenant-id]:[password]@[ip]:[port]/[db-name] -f supabase/migrations/<file>.sql"
```
