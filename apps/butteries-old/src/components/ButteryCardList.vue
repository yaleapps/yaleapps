<template>
  <q-list>
    <ButteryCard
      v-for="(buttery, index) in props.butteries"
      :key="index"
      :buttery="buttery"
    />
  </q-list>
</template>

<script setup lang="ts">
import { Buttery } from 'src/shared/butteries';
import { PropType } from 'vue';
import ButteryCard from './ButteryCard/ButteryCard.vue';

const props = defineProps({
  butteries: {
    type: Array as PropType<Buttery[]>,
    default: () => [],
  },
});
</script>
