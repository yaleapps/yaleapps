<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import SelectCourses from 'src/components/SelectCourses.vue';
import SelectProfessors from 'src/components/SelectProfessors.vue';
import { useFormStore } from 'src/stores/form';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import SelectMajor from './SelectMajor.vue';

const store = useFormStore();
const activeStep = ref(0);

function isValidEmail(email: string) {
	const re = /\S[^\s@]*@\S+\.\S+/;
	return re.test(email);
}

const router = useRouter();
const { mutate: submitUserCourseMutation, isPending: isSubmitLoading } = useMutation({
	mutationFn: () => store.submitForm(),
	onSuccess: () => router.push('/success'),
});

const isStep1Valid = computed(() => {
	return isValidEmail(store.email) && store.major.length > 0;
});

const isStep2Valid = computed(() => {
	return (
		store.selectedFavoriteProfessors.length > 0 &&
		store.selectedFavoriteCourses.length > 0 &&
		store.selectedGuttiestCourses.length > 0
	);
});

const isStep3Valid = computed(() => {
	return (
		store.selectedFavoriteMajorCourses.length > 0 &&
		store.selectedFavoriteDistributionalCourses.length > 0
	);
});

function nextStep() {
	activeStep.value++;
}

function previousStep() {
	activeStep.value--;
}

async function handleFormSubmission() {
	if (store.isFormValid) {
		submitUserCourseMutation();
	}
}

export default {
	async preFetch({ store }) {
		const favoritesStore = useFormStore(store);
		favoritesStore.fetchAbbreviatedCatalog();
	},
};
</script>

<template>
	<q-page padding>
		<q-stepper v-model="activeStep" class="max-width-card q-mx-auto" flat :vertical="$q.screen.width < 600">
			<q-step :name="0" title="Introduction">
				<q-step-content>
					<q-card flat>
						<q-card-section>
							<div class="text-h4 text-weight-light q-mb-lg">
								What are your favorite courses and professors at Yale?
							</div>
							<p class="text-subtitle1 text-weight-light">
								As we wrap up the school year, let's reflect on the courses and professors that
								defined our college experiences. You must participate to see results.
							</p>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							What is your email address? <span class="text-red">*</span>
						</div>
						<q-input v-model="store.email" filled label="Email"
							:rules="[(val) => isValidEmail(val) || 'Please enter a valid email']" />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							What is your major? <span class="text-red">*</span>
						</div>
						<SelectMajor />
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
							<div class="text-h4 text-weight-light q-mb-md">Overall Favorites</div>
							<div class="text-subtitle1 text-weight-light">
								Please answer the required questions regarding your overall favorite professors and
								courses. To access your past courses, you can click "Course History" on
								<a href="https://degreeaudit.yale.edu/" target="_blank"> Yale Degree Audit </a>.
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Favorite <span class="text-weight-bold">professors</span> at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectProfessors key-of-favorites-store="selectedFavoriteProfessors"
							label="Your favorite professors ever. Brilliant, quirky, quintessentially Yale, or all of the above." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Best <span class="text-weight-bold"> overall </span> courses at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses key-of-favorites-store="selectedFavoriteCourses"
							label="Your favorite courses ever. The ones that made you think, laugh, and cry." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							<span class="text-weight-bold">Chillest</span> courses at Yale?
							<span class="text-red">*</span>
						</div>
						<SelectCourses key-of-favorites-store="selectedGuttiestCourses"
							label="The guttiest courses you've ever taken. No stress, no worries." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Any remarks or words to defend your choices?
						</div>
						<q-input v-model="store.remarks" filled label="Your remarks." />
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
							<div class="text-h4 text-weight-light q-mb-md">Category Favorites</div>
							<div class="text-subtitle1 text-weight-light">
								Please answer the following questions regarding domain-specific courses. To access
								your past courses, you can click "Course History" on
								<a href="https://degreeaudit.yale.edu/" target="_blank"> Yale Degree Audit </a>.
							</div>
						</q-card-section>
					</q-card>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Best courses in your major(s):
							<span class="text-weight-bold">{{ store.major.join(', ') }}</span>
							<span class="text-red">*</span>
						</div>
						<SelectCourses key-of-favorites-store="selectedFavoriteMajorCourses"
							label="The course(s) that made you fall in love with your major." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Best
							<span class="text-weight-bold">
								writing, science, QR, social science, or humanities
							</span>
							credits?
							<span class="text-red">*</span>
						</div>
						<SelectCourses key-of-favorites-store="selectedFavoriteDistributionalCourses"
							label="The distributional classes that you loved outside of your major." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Best <span class="text-weight-bold">lecture</span> courses?
						</div>
						<SelectCourses key-of-favorites-store="selectedFavoriteLectureCourses"
							label="Your favorite lecture courses of all time at Yale." />
					</q-card-section>

					<q-card-section>
						<div class="text-h6 text-weight-light q-mb-md">
							Best <span class="text-weight-bold">seminar</span> courses?
						</div>
						<SelectCourses key-of-favorites-store="selectedFavoriteSeminarCourses"
							label="Your favorite seminars of all time at Yale." />
					</q-card-section>

					<div class="q-mt-md">
						<q-btn color="primary" label="Previous" class="q-mr-sm" @click="previousStep" />
						<q-btn color="primary" label="Submit" :disable="!isStep3Valid" :loading="isSubmitLoading"
							@click="handleFormSubmission" />
					</div>
				</q-step-content>
			</q-step>
		</q-stepper>
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
