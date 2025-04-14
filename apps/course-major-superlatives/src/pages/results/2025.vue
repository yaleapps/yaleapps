<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { type } from 'arktype';
import { use2025FormStore } from 'src/stores/form-2025';
import { supabase } from 'src/supabase';

const formStore = use2025FormStore()

function isValidEmail(email: string) {
	const Email = type("string.email")
	const result = Email(email);
	return !(result instanceof type.errors) && email.endsWith("@yale.edu")
}

const { data: submissionData, isLoading, error, refetch } = useQuery({
	queryKey: ['submission', formStore.email],
	queryFn: async () => {
		const { data, error } = await supabase
			.from('superlatives_2025')
			.select('*')
			.eq('email', formStore.email)
			.single();

		if (error) throw error;
		return data;
	},
	enabled: false,
});

async function verifyEmail() {
	if (!isValidEmail(formStore.email)) {
		alert('Please enter a valid Yale email address.');
		return;
	}
	await refetch();

	if (!submissionData.value) {
		alert('You have not submitted the form yet. Please submit the form first to see the results.');
	}
}
</script>

<template>
	<q-page padding>
		<q-card flat class="tw:max-w-4xl q-mx-auto">
			<q-card-section>
				<div class="text-h4 q-mb-lg">
					2025 Course & Professor Superlatives Results
				</div>

				<template v-if="!submissionData">
					<div class="text-subtitle1 q-mb-md">
						Enter your Yale email to view the results. You must have submitted the form to access the results.
					</div>

					<div class="row q-col-gutter-md">
						<div class="col-12 col-sm-8">
							<q-input v-model="formStore.email" filled label="Yale Email"
								:rules="[(val) => isValidEmail(val) || 'Please enter a valid Yale email']" @keyup.enter="verifyEmail" />
						</div>
						<div class="col-12 col-sm-4">
							<q-btn color="primary" label="View Results" class="full-width" :loading="isLoading"
								@click="verifyEmail" />
						</div>
					</div>
				</template>

				<template v-else>
					<div class="text-subtitle1 q-mb-xl">
						Here are the aggregated results from the Class of 2025's course and professor superlatives!
					</div>

					<div class="text-h5 q-mb-md">Most Popular Professors</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=773708567&amp;format=interactive">
					</iframe>

					<div class="text-h5 q-mb-md">Most Popular Courses</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=1313887668&amp;format=interactive"></iframe>

					<div class="text-h5 q-mb-md">Guttiest Courses</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=1475776771&amp;format=interactive"></iframe>

					<div class="text-h5 q-mb-md">Most Unique Courses</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=643668628&amp;format=interactive"></iframe>

					<div class="text-h5 q-mb-md">Most Regretted Courses</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=2018550264&amp;format=interactive"></iframe>

					<div class="text-h5 q-mb-md">Favorite Distributional Courses</div>
					<iframe class="tw:w-full tw:h-[400px] tw:mb-8" seamless frameborder="0" scrolling="no"
						src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTJxsgQFo3drZ6W1OY5DIJrET2QYW1HjEl0Rr-Kav5gTl7N9y0jQ6l0Z2IJvgpLA6Vt7Mb0BfQIwSnM/pubchart?oid=1132528705&amp;format=interactive"></iframe>
				</template>
			</q-card-section>
		</q-card>
	</q-page>
</template>
