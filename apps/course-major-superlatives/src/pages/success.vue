<script setup lang="ts">
import { CURRENT_YEAR } from 'src/router/routes';
</script>

<template>
	<q-page padding>
		<q-card flat class="max-width-card q-mx-auto">
			<q-card-section>
				<div class="text-h4 q-mb-md">
					Thank You! 🎉
				</div>
				<div class="text-subtitle1 q-mb-md">
					Your responses have been recorded, and you will be emailed results in May.
				</div>
				<div class="text-subtitle1 q-mb-md">
					If you would like,
					<a href="sms:&body=superlatives.yaleapps.com"> share this form with a friend </a>
					and spread the word!
				</div>
				<q-btn color="primary" :to="`/results/${CURRENT_YEAR}`" label="View Results" class="q-mt-md" />
			</q-card-section>
		</q-card>
	</q-page>
</template>

<style>
.max-width-card {
	width: 100%;
	border-radius: 8px;
}

@media (min-width: 640px) {
	.max-width-card {
		max-width: 48rem;
	}
}
</style>
