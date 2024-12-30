<template>
  <footer class="bg-zinc-800 text-white py-8">
    <div
      class="mx-8 flex flex-col justify-between items-center space-y-6 desktop:space-y-0 desktop:flex-row"
    >
      <div class="text-center md:text-left">
        <h3 class="text-lg font-semibold text-primary">
          {{ $t('footer.title') }}
        </h3>
        <p class="text-sm text-zinc-300">
          {{ $t('footer.tagline') }}
        </p>
      </div>

      <nav class="flex flex-wrap justify-center gap-6">
        <ULink
          v-for="link in links"
          :key="link.label"
          :to="localePath(link.to)"
          class="hover:text-primary transition-colors duration-200"
        >
          {{ $t(link.label) }}
        </ULink>
      </nav>

      <div class="text-center md:text-right text-sm text-zinc-300">
        {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()

const links: { label: string; to?: string }[] = [
  { label: 'footer.links.home', to: '/' },
  { label: 'footer.links.login', to: '/auth/login' },
  { label: 'footer.links.signup', to: '/auth/signup' },
  { label: 'footer.links.profile', to: '/profile' }
]
</script>
