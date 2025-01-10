<template>
  <footer class="bg-zinc-800 text-white py-6">
    <div
      class="mx-8 flex flex-col items-center justify-between space-y-8 laptop:space-y-0 laptop:flex-row"
    >
      <div class="text-center laptop:text-left laptop:w-1/5">
        <h3 class="text-lg font-semibold text-primary">
          {{ $t('footer.title') }}
        </h3>
        <p class="text-sm text-zinc-300">
          {{ $t('footer.tagline') }}
        </p>
      </div>

      <nav class="laptop:w-3/5 flex flex-wrap justify-evenly gap-4">
        <div class="flex flex-col items-center laptop:items-start gap-2">
          <h4 class="text-sm font-semibold text-primary">{{ $t('footer.category.general') }}</h4>
          <ULink
            v-for="link in generalLinks"
            :key="link.label"
            :to="localePath(link.to)"
            class="text-xs hover:text-primary transition-colors duration-200"
          >
            {{ $t(link.label) }}
          </ULink>
        </div>

        <div class="flex flex-col items-center laptop:items-start gap-2">
          <h4 class="text-sm font-semibold text-primary">
            {{ $t('footer.category.regulations') }}
          </h4>
          <ULink
            v-for="link in regulationLinks"
            :key="link.label"
            :to="localePath(link.to)"
            class="text-xs hover:text-primary transition-colors duration-200"
          >
            {{ $t(link.label) }}
          </ULink>
        </div>
      </nav>

      <div
        class="laptop:w-1/5 flex flex-col gap-2 justify-center items-center text-xs text-zinc-300"
      >
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
