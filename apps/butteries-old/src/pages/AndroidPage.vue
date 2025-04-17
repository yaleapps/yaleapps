<template>
  <q-page>
    <div class="row">
      <q-space></q-space>
      <q-card flat style="width: 400px">
        <q-card-section>
          <div class="text-h6">Install the App On Android</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <p>
            The YBB Android app is currently awaiting approval in the Googe Play
            Store! In the meantime, you can install it as a Progressive Web App
            (PWA).
          </p>
          <p>
            In Chrome, tap the <q-icon name="more_vert" /> button, then 'Install
            App'.
          </p>
          <q-card>
            <q-img src="~assets/AndroidPWAInstallInstructions.png"> </q-img>
          </q-card>
        </q-card-section>
        <q-card-section>
          <p>Alternatively, just tap the 'Add to Home Screen' banner below.</p>
        </q-card-section>
      </q-card>
      <q-space></q-space>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
