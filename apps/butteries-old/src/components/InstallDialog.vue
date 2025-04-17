<template>
  <q-dialog ref="dialogRef">
    <q-card style="width: 400px" flat>
      <q-card-section>
        <div class="text-h6">Install the App</div>
        <div class="text-caption">We are now published to the App Store!</div>
      </q-card-section>
      <q-separator />
      <div class="q-pa-md q-gutter-sm">
        <div class="row justify-between">
          <a
            href="https://apps.apple.com/us/app/yale-buttery-book/id1595499598"
            target="_blank"
            class="col"
          >
            <img src="~assets/DownloadToAppStore.svg" style="width: 88%" />
          </a>

          <q-space> </q-space>

          <a
            href="https://play.google.com/store/apps/details?id=yalebutterybook.com"
            target="_blank"
            class="col"
          >
            <img src="~assets/google.svg" style="width: 100%" />
          </a>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
defineEmits([...useDialogPluginComponent.emits]);
</script>
