<template>
  <div>
    <USeparator class="w-full mb-8" />

    <UContainer
      class="w-full p-8 mb-8 rounded-2xl shadow-2xl bg-gradient-to-br from-[var(--ui-bg-elevated)] via-[var(--ui-bg-muted)] to-[var(--ui-bg-elevated)] text-center"
    >
      <h2 class="text-2xl font-bold mb-6 text-[var(--ui-color-primary-400)]">
        {{ $t('home.footer.title') }}
      </h2>

      <p class="leading-relaxed mb-4">
        {{ $t('home.footer.description.first') }}
      </p>

      <p class="leading-relaxed mb-4">
        {{ $t('home.footer.description.second') }}
      </p>

      <p class="leading-relaxed mb-4">
        {{ $t('home.footer.description.third') }}
      </p>

      <p class="leading-relaxed mb-4">
        {{ $t('home.footer.description.fourth') }}
      </p>

      <p class="text-lg font-semibold">
        {{ $t('home.footer.description.join') }}
      </p>
    </UContainer>
  </div>
</template>
