<template>
  <ClientOnly>
    <div class="flex gap-x-2" :class="{ 'flex-col gap-y-2 items-center': isMobile }">
      <template v-for="(nav, index) in navItems" :key="`nav-${index}`">
        <div :id="nav?.id">
          <UButton
            v-if="!nav.chip?.value"
            :to="nav.to"
            :label="nav.label"
            :icon="nav.icon"
            :chip="nav.chip"
            :variant="isActiveRoute(nav.to) ? 'subtle' : 'link'"
            :color="isActiveRoute(nav.to) ? 'primary' : 'secondary'"
            size="md"
            class="transition-all duration-300 rounded-full w-fit"
            @click="handleItemClick"
          />

          <UChip
            v-else-if="nav.chip?.value"
            :text="nav.chip?.value"
            size="3xl"
            :ui="{
              base: 'p-1'
            }"
            class="transition-all duration-300 rounded-full w-dit"
          >
            <UButton
              :to="nav.to"
              :label="nav.label"
              :icon="nav.icon"
              :chip="nav.chip"
              :variant="isActiveRoute(nav.to) ? 'subtle' : 'link'"
              :color="isActiveRoute(nav.to) ? 'primary' : 'secondary'"
              size="md"
              class="transition-all duration-300 rounded-full w-fit"
              @click="handleItemClick"
            />
          </UChip>
        </div>
      </template>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
const route = useRoute()
const emit = defineEmits(['item-click'])

defineProps({
  navItems: {
    type: Array as PropType<
      Array<{ to: string; label: string; icon: string; chip?: any; id?: string }>
    >,
    required: true
  },
  isMobile: {
    type: Boolean,
    required: true
  }
})

const EXCEPTION_ROUTES = ['/search', '/us/search']

const isActiveRoute = (to: string) => {
  if (EXCEPTION_ROUTES.includes(to)) {
    return route.path === to
  } else if (to.includes('/popular/')) {
    return route.path.startsWith('/popular')
  }
  return route.fullPath === to
}

const handleItemClick = () => {
  emit('item-click')
}
</script>
