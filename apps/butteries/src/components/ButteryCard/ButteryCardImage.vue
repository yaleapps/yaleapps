<template>
  <q-img
    style="max-width: 640px; max-height: 80vh"
    fit="contain"
    :src="`${props.buttery.menu_photo_url}`"
    :alt="props.buttery.id"
    @click="dialog = true"
  >
  </q-img>
  <q-dialog v-model="dialog" :maximized="maximizedToggle">
    <q-card flat style="width: 100vw; max-height: 100vh">
      <q-bar>
        <q-space />
        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-img
        fit="contain"
        :src="`${props.buttery.menu_photo_url}`"
        :alt="props.buttery.id"
        style="display: block"
      >
      </q-img>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { Buttery } from 'src/shared/butteries';

const props = defineProps({
  buttery: {
    type: Object as PropType<Buttery>,
    required: true,
  },
});

const dialog = ref(false);
const maximizedToggle = ref(false);
</script>
