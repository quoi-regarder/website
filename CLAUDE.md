# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server on http://localhost:3000
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint and Prettier (fixes issues automatically)
- `pnpm run lint:eslint` - Run ESLint only
- `pnpm run lint:prettier` - Run Prettier only

## Architecture Overview

### Tech Stack

- **Framework**: Nuxt 4 (RC) with Vue 3 composition API
- **State Management**: Pinia with persisted state
- **Styling**: Tailwind CSS via @nuxt/ui
- **Internationalization**: @nuxtjs/i18n (French default, English support)
- **Package Manager**: pnpm (required)
- **Node Version**: >= 20.0.0

### Project Structure

- `app/` - Main application code (Nuxt 4 structure)
  - `composables/` - Reusable composition functions organized by domain
  - `components/` - Vue components organized by feature/domain
  - `stores/` - Pinia stores for state management
  - `pages/` - File-based routing
  - `middleware/` - Route middleware (auth, guest)
  - `utils/` - Utility functions
- `server/` - Server-side API routes and utilities
- `shared/` - Shared types, models, and utilities between client/server
- `content/` - Nuxt Content markdown files (i18n regulation pages)
- `i18n/locales/` - Translation files (JSON)

### Key Architectural Patterns

#### API Communication

- **External API**: TMDB API via `tmdbFetch()` utility in `server/utils/tmdbFetch.ts`
- **Backend Integration**: Spring Boot API via `apiFetch()` utility in `app/utils/apiFetch.ts`
- **Authentication**: JWT tokens stored in secure cookies via Pinia persisted state
- **Error Handling**: Centralized error status handling with i18n notifications
- **CORS**: Backend accessible via `NUXT_PUBLIC_API_BASE_URL` environment variable

#### State Management Pattern

- **Auth Store**: Token, user ID, and email persistence with 7-day cookie expiry
- **Domain Stores**: Separate stores for movies, series, favorites, watchlists
- **Persisted State**: Cookie storage for auth (secure, HttpOnly), localStorage for other data
- **Reactivity**: Real-time state synchronization via SSE channels

#### Component Architecture

- **Domain-based Organization**: Components organized by feature (movie, tv, profile, home, field, popin)
- **Shared Components**: Common UI components in root components folder
- **Form Handling**: Dedicated composables for form logic with Yup validation
- **Layout System**: Multiple layouts (default, auth, filter) for different UI contexts

#### Real-Time Communication

- **SSE Integration**: Server-Sent Events for real-time updates
- **Channel-based System**: Different channels for movies, series, profiles, favorites, watchlists
- **Connection Management**: Singleton pattern with automatic reconnection
- **Authentication-aware**: Connections automatically managed based on auth state

#### Service Layer Pattern

- **Authentication Service**: Complete auth flow (login, register, social auth, password reset)
- **Domain Services**: Separate services for favorites, watchlists, profiles, viewing details
- **Error Handling**: Structured error responses with i18n support
- **Type Safety**: Full TypeScript support with shared models

### Environment Configuration

Required environment variables:

- `NUXT_TMDB_API_KEY` - The Movie Database API key
- `NUXT_TMDB_BASE_URL` - TMDB API base URL
- `NUXT_PUBLIC_API_BASE_URL` - Internal API base URL
- `NUXT_PUBLIC_MAINTENANCE` - Maintenance mode flag

### Code Style & Conventions

- **ESLint**: Custom configuration with no semicolons, single quotes preference
- **Prettier**: Automated formatting with consistent style
- **Vue 3**: Composition API throughout with `<script setup>` syntax
- **TypeScript**: Strict mode with shared type definitions in `shared/` folder
- **Naming**: PascalCase for components, camelCase for composables, kebab-case for files
- **Git Hooks**: Husky pre-commit hooks for linting and formatting
- **Imports**: Auto-imports for composables, utilities, and shared types

### Authentication Flow

1. Login via `useAuthService()` composable
2. JWT token stored in secure cookie via auth store
3. `apiFetch()` automatically includes Bearer token
4. Auth middleware protects routes
5. Automatic token refresh handling and logout on expiry

### Data Fetching Patterns

- **TMDB API**: Movie/TV data via server-side API routes with caching
- **Backend API**: User data, favorites, watchlists via composable services
- **Caching Strategy**: Built-in Nuxt caching for TMDB data, reactive caching for user data
- **Real-time Updates**: SSE channels for immediate data synchronization
- **Error Boundaries**: Graceful error handling with user-friendly notifications

### Security Considerations

- **JWT Tokens**: Secure cookie storage with HttpOnly flag and 7-day expiry
- **CORS Configuration**: Proper backend integration via environment variables
- **Rate Limiting**: Client-side rate limit detection and user notification
- **Token Refresh**: Automatic logout on token expiry with user notification
- **Sensitive Data**: No secrets or API keys exposed to client-side code

### Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting via Nuxt
- **Image Optimization**: @nuxt/image with custom avatar provider
- **Bundle Analysis**: Optimized dependencies and proper tree shaking
- **Lazy Loading**: Lazy-loaded components and composables
- **SSR**: Server-side rendering for better SEO and initial load performance

### Internationalization (i18n)

- **Default Language**: French (fr-FR) as primary language
- **Supported Languages**: French and English with complete translations
- **URL Strategy**: Prefix strategy (en/ for English, no prefix for French)
- **Content Management**: Separate content files for regulation pages
- **Browser Detection**: Automatic language detection with cookie persistence
