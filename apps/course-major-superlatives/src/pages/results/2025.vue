<script setup lang="ts">
import { isValidYaleEmail } from '@repo/utils';
import { useQuery } from '@tanstack/vue-query';
import SuperlativeChart from 'src/components/SuperlativeChart.vue';
import { useSuperlativesData } from 'src/composables/useSuperlativesData';
import { use2025FormStore } from 'src/stores/form-2025';
import { supabase } from 'src/supabase';
import { onMounted, ref } from 'vue';

const formStore = use2025FormStore();
const { data: chartData, isLoading: isLoadingCharts } = useSuperlativesData();

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

const activeTab = ref('professors');

async function submitEmailToSeeResults() {
	if (!isValidYaleEmail(formStore.email)) {
		alert('Please enter a valid Yale email address.');
		return;
	}
	await refetch();

	if (!submissionData.value) {
		alert('You have not submitted the form yet. Please submit the form first to see the results.');
	}
}

onMounted(() => {
	if (formStore.email && formStore.email.trim() !== '') {
		submitEmailToSeeResults();
	}
});
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
						Enter your Yale email to view the results. You must have submitted the 2025 form to access the results.
					</div>

					<q-input v-model="formStore.email" filled label="Yale Email" class="tw:flex-1"
						:rules="[(val) => isValidYaleEmail(val) ?? 'Please enter a valid Yale email']"
						@keyup.enter="submitEmailToSeeResults" />

					<div class="tw:flex tw:flex-row tw:gap-2">
						<q-btn color="primary" label="View Results" :loading="isLoading" @click="submitEmailToSeeResults" />
						<q-btn type="a" to="/form/2025" label="Go to 2025 form " />
					</div>
				</template>

				<template v-else>
					<div class="text-subtitle1 q-mb-sm">
						Here are the aggregated results from the Class of 2025's course and professor superlatives!
					</div>

					<div class="text-subtitle1 q-mb-md">
						This page shows real-time results as responses come in. The charts update automatically as new submissions
						are received.
					</div>

					<q-banner rounded class="bg-info tw:text-blue-700 q-mb-md">
						<template v-slot:avatar>
							📊
						</template>
						<div class="text-subtitle2 q-mb-sm">About These Results</div>
						<ul class="tw:list-disc tw:ml-4 tw:space-y-1">
							<li>Results may be influenced by class sizes - larger classes naturally receive more votes</li>
							<li>Course popularity can vary by semester and year</li>
							<li>These results reflect student opinions and experiences, not official evaluations</li>
						</ul>
					</q-banner>

					<q-card>
						<q-inner-loading :showing="isLoadingCharts">
							<q-spinner-dots size="50px" color="primary" />
						</q-inner-loading>

						<template v-if="chartData">
							<q-tabs v-model="activeTab" class="tw:rounded-2xl bg-primary text-white" align="justify">
								<q-tab name="professors" icon="school" label="Professors" />
								<q-tab name="courses" icon="book" label="Top Courses" />
								<q-tab name="gutsy" icon="thumb_up" label="Gutsy" />
								<q-tab name="yale" icon="account_balance" label="Yale Spirit" />
								<q-tab name="regrets" icon="warning" label="Regrets" />
								<q-tab name="distributionals" icon="category" label="Distributionals" />
							</q-tabs>

							<q-tab-panels v-model="activeTab" animated>
								<q-tab-panel name="professors">
									<SuperlativeChart :data="chartData.favoriteProfessors" title="Most Popular Professors" color="#2563eb"
										disclaimer="Results may vary based on class sizes" />
								</q-tab-panel>

								<q-tab-panel name="courses">
									<SuperlativeChart :data="chartData.favoriteCourses" title="Most Popular Courses" color="#16a34a"
										disclaimer="Results may vary based on class capacity" />
								</q-tab-panel>

								<q-tab-panel name="gutsy">
									<SuperlativeChart :data="chartData.guttiestCourses" title="Guttiest Courses" color="#dc2626"
										disclaimer="Based on student experiences" />
								</q-tab-panel>

								<q-tab-panel name="yale">
									<SuperlativeChart :data="chartData.quintessentialCourses" title="Most Quintessentially Yale Courses"
										color="#9333ea" disclaimer="Based on student perception" />
								</q-tab-panel>

								<q-tab-panel name="regrets">
									<SuperlativeChart :data="chartData.regrettedCourses" title="Most Regretted Courses" color="#ea580c"
										disclaimer="Individual experiences may vary" />
								</q-tab-panel>

								<q-tab-panel name="distributionals">
									<SuperlativeChart :data="chartData.distributionalCourses" title="Favorite Distributional Courses"
										color="#0d9488" disclaimer="Popularity varies by major requirements" />
								</q-tab-panel>
							</q-tab-panels>
						</template>
					</q-card>
				</template>
			</q-card-section>
		</q-card>
	</q-page>
</template>