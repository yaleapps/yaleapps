<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { use2025FormStore } from 'src/stores/form-2025';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectCourses from './_components/select-courses.vue';
import SelectMajor from './_components/select-major.vue';
import SelectProfessors from './_components/select-professors.vue';
import SelectResidentialCollege from './_components/select-residential-college.vue';
import EmailInput from './_components/email-input.vue';
import { useCoursesStore } from 'src/stores/data/courses';
import { useProfessorsStore } from 'src/stores/data/professors';
import { isValidYaleEmail } from '@repo/utils';

const formStore = use2025FormStore();
const router = useRouter();

const { mutate: submitUserCourseMutation, isPending: isSubmitPending } = useMutation({
	mutationFn: () => formStore.submitForm(),
	onSuccess: () => router.push('/success'),
	onError: () => {
		alert('An error occurred. Please try again.');
	}
});


const activeStep = ref(0);

const isStep1Valid = computed(() => {
	return isValidYaleEmail(formStore.email) &&
		formStore.classYear &&
		formStore.residentialCollege;
});

const isStep2Valid = computed(() => {
	return formStore.selectedFavoriteProfessors.length > 0 &&
		formStore.selectedFavoriteCourses.length > 0 &&
		formStore.selectedGuttiestCourses.length > 0
});

const isStep3Valid = computed(() => {
	const isEveryMajorHasSelectedFavoriteMajorCourses = formStore.major.every((major) =>
		(formStore.selectedFavoriteMajorCourses[major]?.length ?? 0) > 0
	);
	const isEveryMajorHasSelectedMajorSatisfaction = formStore.major.every((major) =>
		formStore.selectedMajorSatisfaction[major] !== undefined
	);
	return formStore.selectedFavoriteDistributionalCourses.length > 0 &&
		formStore.selectedQuintessentiallyYaleCourse.length > 0 &&
		formStore.selectedRegrettedCourses.length > 0 && formStore.major.length > 0 &&
		isEveryMajorHasSelectedFavoriteMajorCourses &&
		isEveryMajorHasSelectedMajorSatisfaction
});

function nextStep() {
	activeStep.value++;
}

function previousStep() {
	activeStep.value--;
}

defineOptions({
	preFetch({ store }) {
		const professorsStore = useProfessorsStore(store);
		const coursesStore = useCoursesStore(store);
		professorsStore.fetchProfessors();
		coursesStore.fetchAbbreviatedCatalog();
	},
})
</script>

<template>
	<q-page padding>
		<q-stepper v-model="activeStep" class="shadow-0 tw:max-w-4xl q-mx-auto" animated>
			<q-step :name="0" :title="$q.screen.width < 600 ? '' : 'Introduction'">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-lg">
								What are the best courses and professors at Yale?
							</div>
							<p class="text-subtitle1">
								As we wrap up the school year, let's reflect on the courses and professors that
								defined our college experiences.
								<span class="text-weight-bold">
									You must participate to see results.
								</span>
							</p>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your Yale email address? <span class="text-red">*</span>
						</div>
						<EmailInput v-model="formStore.email" />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your class year? <span class="text-red">*</span>
						</div>
						<q-select v-model="formStore.classYear" :options="['2024', '2025', '2026', '2027', '2028']" filled
							label="Class Year" />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your residential college? <span class="text-red">*</span>
						</div>
						<SelectResidentialCollege v-model="formStore.residentialCollege" />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Next" :disable="!isStep1Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="1" :title="$q.screen.width < 600 ? '' : 'Overall Favorites'">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Overall Favorites</div>
							<div class="text-subtitle1">
								Please answer the required questions regarding your overall favorite professors and
								courses. To access your past courses, you can click the ellipses, then "Class History" on
								<a class="tw:text-blue-500 tw:hover:underline tw:hover:text-blue-600 tw:font-medium tw:transition"
									href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer"> Yale Degree Audit
								</a>.
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Favorite <span class="text-weight-bold">professors</span> at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectProfessors v-model="formStore.selectedFavoriteProfessors"
							label="Your favorite professors ever. Brilliant, quirky, quintessentially Yale, or all of the above." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">overall</span> courses at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteCourses"
							label="Your favorite courses ever. The ones that made you think, laugh, and cry." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							<span class="text-weight-bold">Guttiest</span> course at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedGuttiestCourses"
							label="The chillest course I've ever taken was..." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Any remarks or words to defend your choices?
						</div>
						<q-input v-model="formStore.remarks" filled
							label="Share any additional thoughts about your courses, professors, or overall Yale experience (optional)." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep2Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="2" :title="$q.screen.width < 600 ? '' : 'Academic Superlatives'">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Academic Superlatives</div>
							<div class="text-subtitle1">
								Vote for your standout courses across different categories - from your major to distribution
								requirements.
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Most <span class="text-weight-bold">unique</span> course?
						</div>
						<SelectCourses v-model="formStore.selectedQuintessentiallyYaleCourse"
							label='The most "quintessentially Yale" course for me were...' />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-sm">
							Most <span class="text-weight-bold">regretted</span> course?
						</div>
						<SelectCourses v-model="formStore.selectedRegrettedCourses" label="I most regret taking ..." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold"> writing, science, QR, social science, and/or humanities </span>
							credits?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteDistributionalCourses"
							label="The easiest science credit I ever took was..." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your major? <span class="text-red">*</span>
						</div>
						<SelectMajor v-model="formStore.major" />
					</q-card-section>

					<template v-for="majorName in formStore.major" :key="majorName">
						<q-card-section>
							<div class="text-h6 q-mb-md">
								Best courses in your major: <span class="text-weight-bold">{{ majorName }}</span>
								<span class="text-red">*</span>
							</div>
							<SelectCourses :model-value="formStore.selectedFavoriteMajorCourses[majorName] ?? []" @update:model-value="(val) => {
								if (!formStore.selectedFavoriteMajorCourses[majorName]) {
									formStore.selectedFavoriteMajorCourses[majorName] = [];
								}
								formStore.selectedFavoriteMajorCourses[majorName] = val;
							}" :label="`The course(s) that made you fall in love with ${majorName}.`" />
						</q-card-section>
					</template>

					<template v-for="majorName in formStore.major" :key="majorName">
						<q-card-section>
							<div class="text-h6 q-mb-md">
								How satisfied are you with {{ majorName }}?
								<span class="text-red">*</span>
							</div>
							<q-rating :model-value="formStore.selectedMajorSatisfaction[majorName] ?? 5" @update:model-value="(val) => {
								formStore.selectedMajorSatisfaction[majorName] = val;
							}" size="2em" :max="10" icon="star_border" icon-selected="star" color="primary" />
							<div class="text-caption q-mt-sm">
								1 = Very Dissatisfied, 10 = Very Satisfied
							</div>
						</q-card-section>
					</template>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Submit" :loading="isSubmitPending" :disable="!isStep3Valid" @click="() => {
							if (isStep3Valid) {
								submitUserCourseMutation();
							}
						}" />
					</div>
				</q-step-content>
			</q-step>
		</q-stepper>
	</q-page>
</template>
