<template>
  <UContainer
    class="px-4 py-8 mt-28 mb-8 gap-y-8 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)] rounded-lg shadow-lg nuxt-content"
  >
    <ContentRenderer v-if="page" :value="page" />
  </UContainer>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

const isDefaultLocale = locale.value === 'fr'
const slugPath = isDefaultLocale ? `/fr${route.path}` : `${route.path}`

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(slugPath).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found'
  })
}
</script>

<style lang="scss">
.nuxt-content {
  color: var(--ui-text);

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--ui-text-highlighted);
  }

  h2 {
    font-size: 1.875rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: var(--ui-text-highlighted);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--ui-text-toned);
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--ui-text-toned);
  }

  h5 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--ui-text-toned);
  }

  h6 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--ui-text-toned);
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--color-primary-400);
    &:hover {
      text-decoration: underline;
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.25rem;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 4px solid var(--color-primary-500);
    font-style: italic;
    margin: 1rem 0;
    color: var(--ui-text-muted);
  }

  hr {
    margin: 2rem 0;
    border-top: 1px solid var(--ui-border);
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.5rem;
  }

  pre {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    background-color: var(--ui-bg-elevated);
  }

  code {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    background-color: var(--ui-bg-muted);
    color: var(--ui-text-toned);
  }

  pre code {
    padding: 0;
    background-color: transparent;
  }

  table {
    width: 100%;
    margin-bottom: 1rem;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid var(--ui-border);
    padding: 0.5rem;
  }

  th {
    font-weight: 700;
    background-color: var(--ui-bg-muted);
  }
}

/* Styles spécifiques pour le mode sombre */
.dark .nuxt-content {
  color: var(--ui-text);

  a {
    color: var(--color-primary-400);
  }

  blockquote {
    color: var(--ui-text-muted);
  }

  pre,
  code {
    background-color: var(--ui-bg-muted);
  }

  th {
    background-color: var(--ui-bg-elevated);
  }
}
</style>
