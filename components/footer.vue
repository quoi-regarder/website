<template>
  <footer class="bg-zinc-800 text-white py-8">
    <div class="mx-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
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
          :to="link.to"
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
const links = [
  { label: 'footer.links.home', to: '/' },
  { label: 'footer.links.login', to: '/auth/login' },
  { label: 'footer.links.signup', to: '/auth/signup' },
  { label: 'footer.links.profile', to: '/profile' }
]
</script>
