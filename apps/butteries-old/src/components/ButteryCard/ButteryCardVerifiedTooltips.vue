<template>
  <q-badge
    v-if="props.verified === 'OPEN'"
    rounded
    color="blue"
    @click.stop="showTooltip"
    ref="tooltip"
  >
    <q-icon name="check" size="0.75em" />
    <q-tooltip
      class="text-body2"
      :anchor="!isMobile() ? 'center right' : undefined"
      :self="!isMobile() ? 'center left' : undefined"
      v-model="showing"
    >
      Buttery Staff verifies that today is open
    </q-tooltip>
  </q-badge>
  <q-badge
    v-else-if="props.verified === 'CLOSED'"
    rounded
    color="red"
    @click.stop="showTooltip"
    ref="tooltip"
  >
    <q-icon name="close" size="0.75em" />
    <q-tooltip
      class="text-body2"
      :anchor="!isMobile() ? 'center right' : undefined"
      :self="!isMobile() ? 'center left' : undefined"
      v-model="showing"
    >
      Buttery Staff verifies that today is closed
    </q-tooltip>
  </q-badge>
  <q-badge v-else rounded color="amber" @click.stop="showTooltip" ref="tooltip">
    <q-icon name="" size="0.75em" />
    <q-tooltip
      class="text-body2"
      :anchor="!isMobile() ? 'center right' : undefined"
      :self="!isMobile() ? 'center left' : undefined"
      v-model="showing"
    >
      Buttery Staff has not yet verified today, going by default schedule
    </q-tooltip>
  </q-badge>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { Buttery } from 'src/shared/butteries';
import { isMobile } from 'src/shared/screen';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  verified: {
    type: String as PropType<Buttery['verified']>,
    default: undefined,
  },
});

const showing = ref(false);
const showTooltip = () => (showing.value = true);
const hideTooltip = () => {
  if (showing.value === true) showing.value = false;
};
const tooltip = ref(null);
onClickOutside(tooltip, hideTooltip);
</script>
