<template>
  <div>
    <!-- Desktop navbar -->
    <div class="h-20 flex mx-8 justify-between items-center gap-x-12">
      <div class="flex items-center gap-x-4">
        <NuxtImg
          src="/favicon.png"
          alt="Logo"
          width="40"
          height="40"
          class="cursor-pointer"
          @click="navigateTo(localePath('/'))"
        />

        <!-- Desktop nav items -->
        <div class="hidden lg:flex">
          <NavbarNavItems :nav-items="navItems" :is-mobile="false" />
        </div>
      </div>

      <!-- Desktop search bar -->
      <div class="items-center flex-2 hidden 2xl:flex max-w-[750px]">
        <NavbarSearchBar />
      </div>

      <div class="flex items-center gap-x-4">
        <!-- Preferences (desktop & mobile) -->
        <NavbarPreferences />

        <!-- User avatar (desktop & mobile) -->
        <NavbarUserAvatar />

        <!-- Mobile menu icon -->
        <div class="relative w-8 h-8 lg:hidden">
          <UIcon
            v-if="!mobileMenuOpenend"
            key="menu-icon"
            name="i-lucide-menu"
            class="absolute inset-0 size-8 cursor-pointer z-50"
            @click="toggleOpen"
          />
          <UIcon
            v-if="mobileMenuOpenend"
            key="close-icon"
            name="i-lucide-x"
            class="absolute inset-0 size-8 cursor-pointer z-50"
            @click="toggleOpen"
          />
        </div>
      </div>

      <!-- Mobile navbar -->
      <transition
        enter-active-class="transition-all transform duration-300 ease-out"
        leave-active-class="transition-all transform duration-300 ease-in"
        enter-from-class="opacity-0 -translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-10"
      >
        <div
          v-if="mobileMenuOpenend"
          class="fixed inset-0 z-40 w-screen h-screen flex flex-row items-center justify-center gap-4 bg-[var(--ui-bg)]/95"
          @click.self="toggleOpen"
        >
          <NavbarNavItems
            :nav-items="navItems"
            :is-mobile="true"
            @item-click="handleNavItemClick"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
const movieListStore = useMovieListStore()
const serieListStore = useSerieListStore()
const localePath = useLocalePath()
const { t } = useI18n()
useMovieListChannel()
useSerieListChannel()

const mobileMenuOpenend = ref(false)

const navItems = computed(() => [
  {
    label: t('navbar.buttons.home'),
    to: localePath('/'),
    icon: 'i-lucide:house'
  },
  {
    label: t('navbar.buttons.trending'),
    to: localePath('/trending'),
    icon: 'i-lucide:trending-up'
  },
  {
    label: t('navbar.buttons.search'),
    to: localePath('/search'),
    icon: 'i-lucide:search'
  },
  {
    label: t('navbar.buttons.movie'),
    to: localePath('/profile?tab=movies'),
    chip: computed(() => movieListStore.getToWatchCount),
    icon: 'i-lucide:clapperboard'
  },
  {
    label: t('navbar.buttons.series'),
    to: localePath('/profile?tab=series'),
    chip: computed(() => serieListStore.getToWatchCount),
    icon: 'i-lucide:tv-minimal-play'
  }
])

const toggleOpen = () => {
  mobileMenuOpenend.value = !mobileMenuOpenend.value
}

const handleNavItemClick = () => {
  mobileMenuOpenend.value = false
}

const disableScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.height = '100vh'
  document.body.style.touchAction = 'none'
}

const enableScroll = () => {
  document.body.style.overflow = ''
  document.body.style.height = ''
  document.body.style.touchAction = ''
}

watch(mobileMenuOpenend, (isOpen) => {
  if (isOpen) {
    disableScroll()
  } else {
    enableScroll()
  }
})

onUnmounted(() => {
  enableScroll()
})
</script>
