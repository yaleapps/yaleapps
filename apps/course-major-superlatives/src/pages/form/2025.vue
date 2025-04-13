<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useFormStore } from 'src/stores/form';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectCourses from './_components/select-courses.vue';
import SelectMajor from './_components/select-major.vue';
import SelectProfessors from './_components/select-professors.vue';
import { useCoursesStore } from 'src/stores/data/courses';
import { useProfessorsStore } from 'src/stores/data/professors';
import { type } from 'arktype';

const formStore = useFormStore();
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
	return isValidEmail(formStore.email) && formStore.major.length > 0;
});

const isStep2Valid = computed(() => {
	return (
		formStore.selectedFavoriteProfessors.length > 0 &&
		formStore.selectedFavoriteCourses.length > 0 &&
		formStore.selectedGuttiestCourses.length > 0
	);
});

const isStep3Valid = computed(() => {
	return (
		formStore.selectedFavoriteMajorCourses.length > 0 &&
		formStore.selectedFavoriteDistributionalCourses.length > 0
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
								What are your favorite courses and professors at Yale?
							</div>
							<p class="text-subtitle1">
								As we wrap up the school year, let's reflect on the courses and professors that
								defined our college experiences. You must participate to see results.
							</p>
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
								courses. To access your past courses, you can click "Class History" on
								<q-btn flat dense color="primary" label="Yale Degree Audit" icon-right="open_in_new" type="a"
									href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer" />
								or

								<q-btn flat dense color="primary" label="Your Unofficial Transcript" icon-right="open_in_new" type="a"
									href="https://studentsystems.yale.edu/StudentSelfService/ssb/academicTranscript#!/UG/WEBY/maintenance"
									target="_blank" rel="noopener noreferrer" />
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
							Best <span class="text-weight-bold"> overall </span> courses at Yale?
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
							label="The guttiest courses you've ever taken. No stress, no worries." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Any remarks or words to defend your choices?
						</div>
						<q-input v-model="formStore.remarks" filled label="Your remarks." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Next" :disable="!isStep2Valid" @click="nextStep" />
					</div>
				</q-step-content>
			</q-step>

			<q-step :name="2" title="Category Favorites">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 q-mb-md">Category Favorites</div>
							<div class="text-subtitle1">
								Please answer the following questions regarding domain-specific courses. To access
								your past courses, you can click "Course History" on
								<q-btn flat dense color="primary" label="Yale Degree Audit" icon-right="open_in_new" type="a"
									href="https://degreeaudit.yale.edu/" target="_blank" rel="noopener noreferrer" />
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best courses in your major(s):
							<span class="text-weight-bold">{{ formStore.major.join(', ') }}</span>
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteMajorCourses"
							label="The course(s) that made you fall in love with your major." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best
							<span class="text-weight-bold">
								writing, science, QR, social science, or humanities
							</span>
							credits?
							<span class="text-red">*</span>
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteDistributionalCourses"
							label="The distributional classes that you loved outside of your major." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">lecture</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteLectureCourses"
							label="Your favorite lecture courses of all time at Yale." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 q-mb-md">
							Best <span class="text-weight-bold">seminar</span> courses?
						</div>
						<SelectCourses v-model="formStore.selectedFavoriteSeminarCourses"
							label="Your favorite seminars of all time at Yale." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Submit" :disable="!isStep3Valid" :loading="isSubmitLoading" @click="() => {
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
