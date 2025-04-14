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
	return !(result instanceof type.errors)
}

const activeStep = ref(0);

const isStep1Valid = computed(() => {
	return isValidEmail(formStore.email) && formStore.classYear && formStore.residentialCollege && formStore.major.length > 0;
});

const isStep2Valid = computed(() => {
	return formStore.selectedFavoriteProfessors.length > 0 &&
		formStore.selectedFavoriteCourses.length > 0 &&
		formStore.selectedGuttiestCourses.length > 0 &&
		formStore.selectedQuintessentiallyYaleCourse.length > 0;
});

const isStep3Valid = computed(() => {
	return formStore.selectedFavoriteDistributionalCourses.length > 0;
});

const isStep4Valid = computed(() => {
	return Object.keys(formStore.selectedFavoriteMajorCourses).length === formStore.major.length &&
		Object.keys(formStore.selectedMajorSatisfaction).length === formStore.major.length;
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
		<q-stepper v-model="activeStep" class="shadow-0 tw:max-w-4xl q-mx-auto" :vertical="$q.screen.width < 600" animated>
			<q-step :name="0" title="Introduction">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-lg">
								What are your favorite courses at Yale?
							</div>
							<p class="text-subtitle1">
								As we wrap up the school year, let's reflect on the courses and professors that
								defined our college experiences.
								<span class="text-weight-bold">
									You must participate to see results.
								</span>
							</p>
							<div class="text-subtitle1 q-mt-md">

								To access your past courses, you can click:
								<div class="q-mt-sm q-gutter-x-sm">
									<q-btn flat dense color="primary" label="Unofficial Transcript" icon-right="open_in_new" type="a"
										href="https://studentsystems.yale.edu/StudentSelfService/ssb/academicTranscript#!/UG/WEBY/maintenance"
										target="_blank" rel="noopener noreferrer" />
									<q-btn flat dense color="primary" label="Yale Degree Audit" icon-right="open_in_new" type="a"
										href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer" />
								</div>
							</div>

						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your email address? <span class="text-red">*</span>
						</div>
						<q-input v-model="formStore.email" filled label="Email"
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

					<q-card-section>
						<div class="text-h6 q-mb-md">
							What is your major? <span class="text-red">*</span>
						</div>
						<SelectMajor v-model="formStore.major" />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Next" :disable="!isStep1Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="1" title="Overall Favorites">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Overall Favorites</div>
							<div class="text-subtitle1">
								Please answer the required questions regarding your overall favorite professors and
								courses. To access your past courses, you can click:
								<div class="q-mt-sm q-gutter-x-sm">
									<q-btn flat dense color="primary" label="Unofficial Transcript" icon-right="open_in_new" type="a"
										href="https://studentsystems.yale.edu/StudentSelfService/ssb/academicTranscript#!/UG/WEBY/maintenance"
										target="_blank" rel="noopener noreferrer" />
									<q-btn flat dense color="primary" label="Yale Degree Audit" icon-right="open_in_new" type="a"
										href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer" />
								</div>
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
							Favorite <span class="text-weight-bold">courses</span> at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteCourses"
							label="Your favorite courses ever. The ones that made you think, laugh, and cry." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							<span class="text-weight-bold">Chillest</span> courses at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedGuttiestCourses"
							label="The easiest courses you've ever taken. No stress, no worries." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Most <span class="text-weight-bold">unique</span> course?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedQuintessentiallyYaleCourse"
							label='The most "quintessentially Yale courses" that you could not help but love.' />
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

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep2Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="2" title="Course Categories">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Course Categories</div>
							<div class="text-subtitle1">
								Please answer the following questions regarding domain-specific courses. To access
								your past courses, you can click:
								<div class="q-mt-sm q-gutter-x-sm">
									<q-btn flat dense color="primary" label="Unofficial Transcript" icon-right="open_in_new" type="a"
										href="https://studentsystems.yale.edu/StudentSelfService/ssb/academicTranscript#!/UG/WEBY/maintenance"
										target="_blank" rel="noopener noreferrer" />
									<q-btn flat dense color="primary" label="Yale Degree Audit" icon-right="open_in_new" type="a"
										href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer" />
								</div>
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">distributional requirement</span> courses?
							<span class="text-red">*</span>
						</div>
						<div class="text-caption q-mb-sm">
							The best courses you loved outside of your major, including Writing (WR),
							Quantitative Reasoning (QR), Science (SC), Social Sciences (SO), and Humanities (HU).
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteDistributionalCourses"
							label="The distributional classes that you loved outside of your major." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">lecture</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedBestLectureCourses"
							label="Your favorite lecture courses of all time at Yale." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">seminar</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedBestSeminarCourses"
							label="Your favorite seminars of all time at Yale." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Most <span class="text-weight-bold">overrated</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedOverratedCourses" label="Courses that are not worth the hype." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep3Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="3" title="Final Reflections">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Final Reflections</div>
							<div class="text-subtitle1">
								Let's reflect on your overall Yale experience and daily student life.
							</div>
						</q-card-section>
					</q-card>

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
							What time do you usually go to bed during the semester?
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
							Any final thoughts or reflections on your Yale experience?
						</div>
						<q-input v-model="formStore.remarks" filled type="textarea"
							label="Share any additional thoughts about your courses, professors, or overall Yale experience." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Submit" :loading="isSubmitLoading" @click="() => {
							if (formStore.isFormValid) {
								submitUserCourseMutation();
							}
						}" />
					</div>
				</q-step-content>
			</q-step>
		</q-stepper>
	</q-page>
</template>
