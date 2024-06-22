<script setup lang="ts">
import ConfigDialog from '~/components/ConfigDialog.vue'
</script>

<template>
  <NuxtLayout name="default">
    <NuxtRouteAnnouncer />

    <ConfigDialog />

    <NuxtPage />
  </NuxtLayout>
</template>
