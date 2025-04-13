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
	return (
		formStore.selectedFavoriteProfessors.length > 0 &&
		formStore.selectedFavoriteCourses.length > 0 &&
		formStore.selectedGuttiestCourses.length > 0 &&
		formStore.selectedQuintessentiallyYaleCourse.length > 0
	);
});

const isStep3Valid = computed(() => {
	return (
		formStore.selectedUnderratedCourses.length > 0 &&
		formStore.selectedOverratedCourses.length > 0 &&
		formStore.selectedBestLectureCourses.length > 0 &&
		formStore.selectedBestSeminarCourses.length > 0
	);
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
								defined our college experiences. You must participate to see results.
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
								Let's start with your overall favorites at Yale! Think about the courses and professors that made your
								Yale experience special.
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
							Most <span class="text-weight-bold">quintessentially Yale</span> course?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedQuintessentiallyYaleCourse"
							label="The course that embodied the Yale experience for you." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep2Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="2" title="Course Superlatives">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Course Superlatives</div>
							<div class="text-subtitle1">
								Time for the fun part! Let's talk about the courses that stood out in different ways.
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							<span class="text-weight-bold">Chillest</span> courses at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedGuttiestCourses"
							label="The guttiest courses you've ever taken. No stress, no worries." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Most <span class="text-weight-bold">underrated</span> courses at Yale?
						</div>
						<SelectCourses v-model="formStore.selectedUnderratedCourses"
							label="The hidden gems that deserve more recognition." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Most <span class="text-weight-bold">overrated</span> courses at Yale?
						</div>
						<SelectCourses v-model="formStore.selectedOverratedCourses"
							label="The courses that didn't live up to the hype." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">lecture</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedBestLectureCourses"
							label="The most engaging and well-taught lectures." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">seminar</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedBestSeminarCourses"
							label="The most engaging and discussion-rich seminars." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep3Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="3" title="Major Deep Dive">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Your Major Journey</div>
							<div class="text-subtitle1">
								Let's dive deep into your major experience at Yale.
							</div>
						</q-card-section>
					</q-card>

					<template v-for="majorName in formStore.major" :key="majorName">
						<q-card-section>
							<div class="text-h6 q-mb-md">
								Best courses in your major: <span class="text-weight-bold">{{ majorName }}</span>
								<span class="text-red">*</span>
							</div>
							<SelectCourses :model-value="formStore.selectedFavoriteMajorCoursesMap[majorName]?.courses ?? []"
								@update:model-value="(val) => {
									if (!formStore.selectedFavoriteMajorCoursesMap[majorName]) {
										formStore.selectedFavoriteMajorCoursesMap[majorName] = { courses: [], satisfaction: 5 };
									}
									formStore.selectedFavoriteMajorCoursesMap[majorName].courses = val;
								}" :label="`The course(s) that made you fall in love with ${majorName}.`" />

							<div class="text-subtitle1 q-mt-md">
								How satisfied are you with {{ majorName }}?
							</div>
							<q-rating :model-value="formStore.selectedFavoriteMajorCoursesMap[majorName]?.satisfaction ?? 5"
								@update:model-value="(val) => {
									if (!formStore.selectedFavoriteMajorCoursesMap[majorName]) {
										formStore.selectedFavoriteMajorCoursesMap[majorName] = { courses: [], satisfaction: val };
									} else {
										formStore.selectedFavoriteMajorCoursesMap[majorName].satisfaction = val;
									}
								}" size="2em" :max="10" icon="star_border" icon-selected="star" color="primary" />
							<div class="text-caption q-mt-sm">
								1 = Very Dissatisfied, 10 = Very Satisfied
							</div>
						</q-card-section>
					</template>

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
							Any remarks or words to defend your choices?
						</div>
						<q-input v-model="formStore.remarks" filled type="textarea" label="Your remarks." />
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
