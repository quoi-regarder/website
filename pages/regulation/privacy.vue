<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 my-8 space-y-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg"
  >
    <!-- Header -->
    <header class="space-y-4">
      <h1 class="text-4xl font-bold text-primary">
        {{ $t('privacy.title') }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ $t('privacy.description') }}
      </p>
    </header>

    <!-- Main Content -->
    <main class="space-y-12">
      <!-- Introduction -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.introduction.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.introduction.content') }}
        </p>
      </section>

      <!-- Data Collected -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.dataCollected.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataCollected.content') }}
        </p>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataCollected.mainData') }}
        </p>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataCollected.additional') }}
        </p>
      </section>

      <!-- Data Purpose -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.dataPurpose.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataPurpose.content') }}
        </p>
      </section>

      <!-- Legal Basis -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.legalBasis.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.legalBasis.content') }}
        </p>
      </section>

      <!-- Data Retention -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.dataRetention.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataRetention.content') }}
        </p>
      </section>

      <!-- Data Sharing -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.dataSharing.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataSharing.content') }}
        </p>
      </section>

      <!-- Data Security -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.dataSecurity.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.dataSecurity.content') }}
        </p>
      </section>

      <!-- User Rights -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.userRights.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.userRights.content') }}
        </p>
        <p class="leading-relaxed">
          {{ $t('privacy.sections.userRights.contact') }}
          <a href="mailto:egenr.pro@gmail.com" class="text-primary hover:underline">
            egenr.pro@gmail.com
          </a>
        </p>
      </section>

      <!-- International Transfer -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.internationalTransfer.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.internationalTransfer.content') }}
        </p>
      </section>

      <!-- Cookies -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.cookies.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.cookies.content') }}
        </p>
      </section>

      <!-- Policy Updates -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.policyUpdates.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.policyUpdates.content') }}
        </p>
      </section>

      <!-- Contact -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('privacy.sections.contact.title') }}
        </h2>
        <p class="leading-relaxed text-justify">
          {{ $t('privacy.sections.contact.content') }}
          <a href="mailto:egenr.pro@gmail.com" class="text-primary hover:underline">
            egenr.pro@gmail.com
          </a>
        </p>
      </section>
    </main>

    <!-- Footer -->
    <footer class="pt-8 mt-12 border-t border-gray-300 dark:border-gray-700">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('privacy.lastUpdate') }}: {{ $t('privacy.updateDate') }}
      </p>
    </footer>
  </div>
</template>

<script setup>
const { t } = useI18n()
useHead({
  title: t('seo.pages.regulation.privacy'),
  meta: [{ name: 'description', content: t('seo.descriptions.regulation.privacy') }]
})
</script>
