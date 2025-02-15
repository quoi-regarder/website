<template>
  <footer class="py-6 bg-[var(--ui-bg-elevated)] dark:bg-[var(--ui-bg-muted)]">
    <div class="mx-8 flex flex-col items-center justify-between gap-y-8 lg:gap-y-0 lg:flex-row">
      <div class="text-center lg:text-left lg:w-1/5">
        <h3 class="text-lg font-semibold text-[var(--ui-color-primary-400)]">
          {{ $t('footer.title') }}
        </h3>
        <p class="text-sm">
          {{ $t('footer.tagline') }}
        </p>

        <div class="gap-2 mt-4 flex flex-col items-center lg:items-start">
          <NuxtImg src="/tmdb_logo.svg" alt="TMDB Logo" width="100" />

          <p class="text-sm">
            {{ $t('footer.tmdb') }}
          </p>
        </div>
      </div>

      <nav class="lg:w-3/5 flex flex-wrap justify-evenly gap-4">
        <div class="flex flex-col items-center lg:items-start gap-2">
          <h4 class="font-semibold text-[var(--ui-color-primary-400)]">
            {{ $t('footer.category.general') }}
          </h4>
          <ULink
            v-for="link in generalLinks"
            :key="link.label"
            :to="localePath(link.to)"
            class="text-sm transition-colors duration-200"
          >
            {{ $t(link.label) }}
          </ULink>
        </div>

        <div class="flex flex-col items-center lg:items-start gap-2">
          <h4 class="font-semibold text-[var(--ui-color-primary-400)]">
            {{ $t('footer.category.regulations') }}
          </h4>
          <ULink
            v-for="link in regulationLinks"
            :key="link.label"
            :to="localePath(link.to)"
            class="text-sm transition-colors duration-200"
          >
            {{ $t(link.label) }}
          </ULink>
        </div>
      </nav>

      <div class="lg:w-1/5 flex flex-col gap-2 justify-center items-center text-sm">
        <NuxtImg
          src="/favicon.png"
          alt="Logo"
          width="40"
          height="40"
          class="cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />
        <p>
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()

const generalLinks: { label: string; to?: string }[] = [
  { label: 'footer.links.home', to: '/' },
  { label: 'footer.links.login', to: '/auth/login' },
  { label: 'footer.links.signup', to: '/auth/signup' },
  { label: 'footer.links.profile', to: '/profile' }
]

const regulationLinks: { label: string; to?: string }[] = [
  { label: 'footer.links.cookie', to: '/regulation/cookie' },
  { label: 'footer.links.legal', to: '/regulation/legal' },
  { label: 'footer.links.privacy', to: '/regulation/privacy' },
  { label: 'footer.links.terms', to: '/regulation/terms' }
]
</script>
