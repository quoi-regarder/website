<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <field-input
      v-model="search"
      :placeholder="$t('home.form.placeholders.search')"
      name="search"
      :label="$t('home.form.fields.search')"
      icon="search"
      class="w-full"
    />

    <UButton @click="searchQuery">
      {{ $t('home.form.buttons.search') }}
    </UButton>
    <div class="flex w-full gap-4 p-4">
      <div class="flex flex-col gap-4 items-center w-3/5">
        <ClientOnly>
          <HomePlatforms @update:selected-platforms="selectedPlatforms = $event" />
          <HomeType @update:selected-types="selectedTypes = $event" />
          <HomeGenre @update:selected-genres="selectedGenres = $event" />
          <HomeAge @update:selected-ages="selectedAges = $event" />
        </ClientOnly>
      </div>
      <div class="border-r-2 border-gray-600"></div>
      <div class="flex flex-col gap-4 items-center w-2/5">
        <ClientOnly>
          <HomeYear @update:selected-years="selectedYears = $event" />
          <HomeFilter @update:selected-filter="selectedFilter = $event" />
          <HomeMark @update:selected-mark="selectedMark = $event" />
          <HomeDirector @update:selected-directors="selectedDirectors = $event" />
          <HomeActor @update:selected-actors="selectedActors = $event" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
useHead({
  title: t('seo.title'),
  meta: [
    {
      name: 'description',
      content: t('seo.description')
    }
  ]
})

const selectedPlatforms = ref<Badge[]>([])
const selectedTypes = ref<Badge[]>([])
const selectedGenres = ref<Badge[]>([])
const selectedAges = ref<Badge[]>([])
const selectedFilter = ref<Badge[]>([])
const selectedMark = ref<number>(1)
const selectedYears = ref<Option[]>([])
const selectedDirectors = ref<Option[]>([])
const selectedActors = ref<Option[]>([])

const search = ref<string>('')
const searchQuery = async () => {
  await $fetch('/api/themoviedb/discover/movie')
}
</script>
