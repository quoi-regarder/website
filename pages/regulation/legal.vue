<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 my-8 space-y-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg"
  >
    <!-- Header -->
    <header class="space-y-4">
      <h1 class="text-4xl font-bold text-primary">{{ $t('legal.title') }}</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">{{ $t('legal.description') }}</p>
    </header>

    <!-- Main Content -->
    <main class="space-y-12">
      <!-- Publishers -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">{{ $t('legal.sections.publishers.title') }}</h2>
        <div class="space-y-2">
          <p class="text-justify">{{ $t('legal.sections.publishers.content') }}</p>
          <ol class="space-y-2 pl-4 list-disc">
            <li class="text-justify">{{ $t('legal.sections.publishers.owner1') }}</li>
            <li class="text-justify">{{ $t('legal.sections.publishers.owner2') }}</li>
          </ol>
          <p class="mt-4 text-justify">{{ $t('legal.sections.publishers.responsible') }}</p>
        </div>
      </section>

      <!-- Hosting -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">{{ $t('legal.sections.hosting.title') }}</h2>
        <div class="space-y-2">
          <div class="flex flex-row space-x-2">
            <p class="text-justify">{{ $t('legal.sections.hosting.content') }}</p>
            <p class="font-bold text-justify">{{ $t('legal.sections.hosting.company') }}</p>
          </div>

          <p class="text-justify">{{ $t('legal.sections.hosting.details.address') }}</p>
          <p class="text-justify">{{ $t('legal.sections.hosting.details.phone') }}</p>
          <p class="text-justify">
            {{ $t('legal.sections.hosting.details.website') }}
            <a
              href="https://www.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              {{ $t('legal.sections.hosting.details.url') }}
            </a>
          </p>
        </div>
      </section>

      <!-- Data Processing -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('legal.sections.dataProcessing.title') }}
        </h2>
        <div class="space-y-6">
          <p class="text-justify">{{ $t('legal.sections.dataProcessing.intro') }}</p>
          <div class="space-y-2">
            <p class="text-justify">
              {{ $t('legal.sections.dataProcessing.purposes.userSystem') }}
            </p>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.purposes.traffic') }}</p>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.purposes.auth') }}</p>
          </div>

          <!-- Retention -->
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-primary">
              {{ $t('legal.sections.dataProcessing.retention.title') }}
            </h3>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.retention.content') }}</p>
          </div>

          <!-- Rights -->
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-primary">
              {{ $t('legal.sections.dataProcessing.rights.title') }}
            </h3>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.rights.intro') }}</p>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.rights.content') }}</p>
            <p class="leading-relaxed">
              {{ $t('legal.sections.dataProcessing.rights.contact') }}
              <a href="mailto:egenr.pro@gmail.com" class="text-primary hover:underline"
                >egenr.pro@gmail.com</a
              >
            </p>
          </div>

          <!-- CNIL -->
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-primary">
              {{ $t('legal.sections.dataProcessing.cnil.title') }}
            </h3>
            <p class="text-justify">{{ $t('legal.sections.dataProcessing.cnil.content') }}</p>
          </div>
        </div>
      </section>

      <!-- Cookies -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">{{ $t('legal.sections.cookies.title') }}</h2>
        <div class="space-y-4">
          <p class="text-justify">{{ $t('legal.sections.cookies.content') }}</p>
          <div class="space-y-2">
            <p class="text-justify">{{ $t('legal.sections.cookies.types.functional') }}</p>
            <p class="text-justify">{{ $t('legal.sections.cookies.types.analytics') }}</p>
          </div>
          <p class="text-justify">{{ $t('legal.sections.cookies.management') }}</p>
        </div>
      </section>

      <!-- Intellectual Property -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">
          {{ $t('legal.sections.intellectualProperty.title') }}
        </h2>
        <p class="text-justify">{{ $t('legal.sections.intellectualProperty.content') }}</p>
      </section>

      <!-- Liability -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">{{ $t('legal.sections.liability.title') }}</h2>
        <p class="text-justify">{{ $t('legal.sections.liability.content') }}</p>
      </section>

      <!-- Contact -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-primary">{{ $t('legal.sections.contact.title') }}</h2>
        <div class="space-y-2">
          <span class="text-justify">{{ $t('legal.sections.contact.content') }}</span>
          <a href="mailto:egenr.pro@gmail.com" class="text-primary hover:underline ml-2"
            >egenr.pro@gmail.com</a
          >
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="pt-8 mt-12 border-t border-gray-300 dark:border-gray-700">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('legal.lastUpdate') }}: {{ $t('legal.updateDate') }}
      </p>
    </footer>
  </div>
</template>

<script setup>
const { t } = useI18n()
useHead({
  title: t('seo.pages.regulation.legal'),
  meta: [{ name: 'description', content: t('seo.descriptions.regulation.legal') }]
})
</script>
