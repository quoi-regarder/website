<template>
  <ClientOnly>
    <div class="flex gap-x-2">
      <template v-for="(nav, index) in navItems" :key="`nav-${index}`">
        <UButton
          v-if="!nav.chip?.value"
          :to="nav.to"
          :label="nav.label"
          :icon="nav.icon"
          :chip="nav.chip"
          :variant="isActiveRoute(nav.to) ? 'subtle' : 'link'"
          :color="isActiveRoute(nav.to) ? 'primary' : 'secondary'"
          size="md"
          class="transition-all duration-300 rounded-full"
        />

        <UChip
          v-else-if="nav.chip?.value"
          :text="nav.chip?.value"
          size="3xl"
          :ui="{ base: 'p-1' }"
          class="transition-all duration-300 rounded-full"
        >
          <UButton
            :to="nav.to"
            :label="nav.label"
            :icon="nav.icon"
            :chip="nav.chip"
            :variant="isActiveRoute(nav.to) ? 'subtle' : 'link'"
            :color="isActiveRoute(nav.to) ? 'primary' : 'secondary'"
            size="md"
            class="transition-all duration-300 rounded-full"
          />
        </UChip>
      </template>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
const route = useRoute()

defineProps({
  navItems: {
    type: Array as PropType<Array<{ to: string; label: string; icon: string; chip?: any }>>,
    required: true
  }
})

const EXCEPTION_ROUTES = ['/search']

const isActiveRoute = (to: string) => {
  return EXCEPTION_ROUTES.includes(to) ? route.path === to : route.fullPath === to
}
</script>
