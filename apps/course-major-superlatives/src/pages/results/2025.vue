<script setup lang="ts">
import { isValidYaleEmail } from '@repo/utils';
import { useQuery } from '@tanstack/vue-query';
import SuperlativeChart from 'src/components/SuperlativeChart.vue';
import { type CourseAggregationLevel, useSuperlativesChartData } from 'src/composables/useSuperlativesChartData';
import { use2025FormStore } from 'src/stores/form-2025';
import { supabase } from 'src/supabase';
import { onMounted, ref, computed } from 'vue';
import EmailInput from '../form/_components/email-input.vue';
import MajorSatisfactionChart from 'src/components/MajorSatisfactionChart.vue';
import MajorDistributionChart from 'src/components/MajorDistributionChart.vue';
import MajorPopularityChart from 'src/components/MajorPopularityChart.vue';

const formStore = use2025FormStore();
const aggregationLevel = ref<CourseAggregationLevel>('course');
const { data: chartData, isLoading: isLoadingCharts } = useSuperlativesChartData(aggregationLevel);

// Query for user's submission (for access control)
const { data: userSubmission, isLoading: isLoadingUserSubmission, error: userError, refetch: refetchUser } = useQuery({
	queryKey: ['user-submission', formStore.email],
	queryFn: async () => {
		const { data, error } = await supabase
			.from('superlatives_2025')
			.select('email')
			.eq('email', formStore.email);

		if (error) throw error;
		return data;
	},
	enabled: false,
});

const hasSubmitted = computed(() => (userSubmission?.value?.length ?? 0) > 0);

const { data: allSubmissions, isLoading: isLoadingAllSubmissions } = useQuery({
	queryKey: ['all-submissions'],
	queryFn: async () => {
		const { data, error } = await supabase
			.from('superlatives_2025')
			.select('*');  // We need all fields to match the expected type

		if (error) throw error;
		return data;
	},
	enabled: hasSubmitted.value,
});

const submissionData = computed(() => userSubmission?.value ?? []);
const isLoadingState = computed(() => isLoadingUserSubmission.value || isLoadingAllSubmissions.value);

const activeTab = ref('professors');

async function submitEmailToSeeResults() {
	if (!isValidYaleEmail(formStore.email)) {
		alert('Please enter a valid Yale email address.');
		return;
	}
	await refetchUser();

	if (!(userSubmission?.value?.length ?? 0)) {
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

					<EmailInput v-model="formStore.email" class="tw:flex-1" @keyup.enter="submitEmailToSeeResults" />

					<div class="tw:flex tw:flex-row tw:gap-2">
						<q-btn color="primary" label="View Results" :loading="isLoadingState" @click="submitEmailToSeeResults" />
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

					<q-banner rounded class="bg-info q-mb-md">
						<template v-slot:avatar>
							📊
						</template>
						<div class="text-subtitle2 q-mb-sm">About These Results</div>
						<ul class="tw:list-disc tw:ml-4 tw:space-y-1">
							<li>Results may be influenced by class sizes - larger classes naturally receive more votes</li>
							<li>Course popularity can vary by semester and year</li>
							<li>These results reflect student opinions and experiences, not official evaluations</li>
							<li>
								{{ aggregationLevel === 'course-and-professor'
									? 'Courses are shown separately for each professor'
									: 'All sections of the same course are combined' }}
							</li>
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
								<q-tab name="major-satisfaction" icon="sentiment_satisfied" label="Major Satisfaction" />
								<q-tab name="major-distribution" icon="bar_chart" label="Major Ratings" />
								<q-tab name="major-popularity" icon="trending_up" label="Major Popularity" />
							</q-tabs>

							<q-tab-panels v-model="activeTab" animated>
								<q-tab-panel name="professors">
									<SuperlativeChart :data="chartData.favoriteProfessors" title="Most Popular Professors" color="#2563eb"
										disclaimer="Results may vary based on class sizes" />
								</q-tab-panel>

								<q-tab-panel name="courses">
									<q-tabs v-model="aggregationLevel" class="tw:rounded-lg q-mb-md" narrow-indicator align="justify">
										<q-tab name="course" label="All Course Sections Together" />
										<q-tab name="course-and-professor" label="View Sections By Individual Professor" />
									</q-tabs>
									<SuperlativeChart :data="chartData.favoriteCourses" title="Most Popular Courses" color="#16a34a"
										disclaimer="Results may vary based on class capacity" />
								</q-tab-panel>

								<q-tab-panel name="gutsy">
									<q-tabs v-model="aggregationLevel" class="tw:rounded-lg q-mb-md" narrow-indicator align="justify">
										<q-tab name="course" label="All Course Sections Together" />
										<q-tab name="course-and-professor" label="View Sections By Individual Professor" />
									</q-tabs>
									<SuperlativeChart :data="chartData.guttiestCourses" title="Guttiest Courses" color="#dc2626"
										disclaimer="Based on student experiences" />
								</q-tab-panel>

								<q-tab-panel name="yale">
									<q-tabs v-model="aggregationLevel" class="tw:rounded-lg q-mb-md" narrow-indicator align="justify">
										<q-tab name="course" label="All Course Sections Together" />
										<q-tab name="course-and-professor" label="View Sections By Individual Professor" />
									</q-tabs>
									<SuperlativeChart :data="chartData.quintessentialCourses" title="Most Quintessentially Yale Courses"
										color="#9333ea" disclaimer="Based on student perception" />
								</q-tab-panel>

								<q-tab-panel name="regrets">
									<q-tabs v-model="aggregationLevel" class="tw:rounded-lg q-mb-md" narrow-indicator align="justify">
										<q-tab name="course" label="All Course Sections Together" />
										<q-tab name="course-and-professor" label="View Sections By Individual Professor" />
									</q-tabs>
									<SuperlativeChart :data="chartData.regrettedCourses" title="Most Regretted Courses" color="#ea580c"
										disclaimer="Individual experiences may vary" />
								</q-tab-panel>

								<q-tab-panel name="distributionals">
									<q-tabs v-model="aggregationLevel" class="tw:rounded-lg q-mb-md" narrow-indicator align="justify">
										<q-tab name="course" label="All Course Sections Together" />
										<q-tab name="course-and-professor" label="View Sections By Individual Professor" />
									</q-tabs>
									<SuperlativeChart :data="chartData.distributionalCourses" title="Favorite Distributional Courses"
										color="#0d9488" disclaimer="Popularity varies by major requirements" />
								</q-tab-panel>

								<q-tab-panel name="major-satisfaction">
									<MajorSatisfactionChart :data="chartData?.majorStats || []" title="Major Satisfaction Ratings" />
								</q-tab-panel>

								<q-tab-panel name="major-distribution">
									<MajorDistributionChart :data="chartData?.majorStats || []" title="Major Rating Distribution" />
								</q-tab-panel>

								<q-tab-panel name="major-popularity">
									<MajorPopularityChart :data="chartData?.majorStats || []" title="Major Popularity" />
								</q-tab-panel>
							</q-tab-panels>
						</template>
					</q-card>
				</template>
			</q-card-section>
		</q-card>
	</q-page>
</template>