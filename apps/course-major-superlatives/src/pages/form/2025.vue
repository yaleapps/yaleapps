<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { use2025FormStore } from 'src/stores/form-2025';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectCourses from './_components/select-courses.vue';
import SelectMajor from './_components/select-major.vue';
import SelectProfessors from './_components/select-professors.vue';
import SelectResidentialCollege from './_components/select-residential-college.vue';
import { useCoursesStore } from 'src/stores/data/courses';
import { useProfessorsStore } from 'src/stores/data/professors';
import { type } from 'arktype';

const formStore = use2025FormStore();
const router = useRouter();

const { mutate: submitUserCourseMutation, isPending: isSubmitLoading } = useMutation({
	mutationFn: () => formStore.submitForm(),
	onSuccess: () => router.push('/success'),
});

function isValidEmail(email: string) {
	const Email = type("string.email")
	const result = Email(email);
	return !(result instanceof type.errors) && email.endsWith("@yale.edu")
}

const activeStep = ref(0);

const isStep1Valid = computed(() => {
	return isValidEmail(formStore.email) && formStore.classYear && formStore.residentialCollege;
});

const isStep2Valid = computed(() => {
	return formStore.selectedFavoriteProfessors.length > 0 &&
		formStore.selectedFavoriteCourses.length > 0 &&
		formStore.selectedGuttiestCourses.length > 0 &&
		formStore.selectedFavoriteDistributionalCourses.length > 0
});

const isStep3Valid = computed(() => {
	const isEveryMajorHasSelectedFavoriteMajorCourses = formStore.major.every((major) => (formStore.selectedFavoriteMajorCourses[major]?.length ?? 0) > 0);
	const isEveryMajorHasSelectedMajorSatisfaction = formStore.major.every((major) => formStore.selectedMajorSatisfaction[major] !== undefined);
	return formStore.major.length > 0 &&
		isEveryMajorHasSelectedFavoriteMajorCourses &&
		isEveryMajorHasSelectedMajorSatisfaction;
});

const isStep4Valid = computed(() => {
	return formStore.studySpot?.length > 0 && formStore.bedtime;
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
						<q-input v-model="formStore.email" filled label="Email" autocapitalize="off"
							:rules="[(val) => isValidEmail(val) || 'Please enter a valid email']" />
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
							Most <span class="text-weight-bold">chill</span> course at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedGuttiestCourses"
							label="The chillest course I've ever taken was..." />
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

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep2Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="2" :title="$q.screen.width < 600 ? '' : 'Major Information'">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Major Information</div>
							<div class="text-subtitle1">
								Please tell us about your major(s) and your experiences in them.
							</div>
						</q-card-section>
					</q-card>

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

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Where do you usually study?
						</div>
						<q-select v-model="formStore.studySpot" :options="[
							'Sterling Memorial Library',
							'Bass Library',
							'Residential College Library',
							'Common Room',
							'Your Room',
							'Cross Campus',
							'Coffee Shop',
							'Other'
						]" filled label="Favorite study spot" multiple />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What time do you usually go to bed?
						</div>
						<q-select v-model="formStore.bedtime" :options="[
							'8:00 PM',
							'9:00 PM',
							'10:00 PM',
							'11:00 PM',
							'12:00 AM',
							'1:00 AM',
							'2:00 AM',
							'3:00 AM'
						]" filled label="Typical bedtime" />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Any remarks or words to share about your Yale experience?
						</div>
						<q-input v-model="formStore.remarks" filled
							label="Share any additional thoughts about your courses, professors, or overall Yale experience (optional)." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Submit" :loading="isSubmitLoading" :disable="!isStep4Valid" @click="() => {
							if (isStep4Valid) {
								submitUserCourseMutation();
							}
						}" />
					</div>
				</q-step-content>
			</q-step>
		</q-stepper>
	</q-page>
</template>
