<script setup lang="ts">
import { isValidYaleEmail } from '@repo/utils';

const modelValue = defineModel<string>({ required: true });
const props = defineProps<{ class?: string }>()
</script>

<template>
    <q-input
      :model-value="modelValue"
      @update:model-value="value => modelValue = value?.toString().toLowerCase() ?? ''"
      filled
		label="Email"
		autocapitalize="off"
		:rules="[(val) => isValidYaleEmail(val) || 'Please enter a valid Yale email']"
		:class="props.class"
	/>
</template>
