<template>
  <q-page padding>
    <q-stepper
      v-model="activeStep"
      class="max-width-card q-mx-auto"
      flat
      :vertical="$q.screen.width < 600"
    >
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
            <q-input
              filled
              label="Email"
              v-model="email"
              :rules="[(val) => isValidEmail(val) || 'Please enter a valid email']"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              What is your major? <span class="text-red">*</span>
            </div>
            <SelectMajor />
          </q-card-section>

          <div class="q-mt-md">
            <q-btn color="primary" label="Next" @click="nextStep" :disable="!isStep1Valid" />
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
            <SelectProfessors
              keyOfFavoritesStore="selectedFavoriteProfessors"
              label="Your favorite professors ever. Brilliant, quirky, quintessentially Yale, or all of the above."
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              Best <span class="text-weight-bold"> overall </span> courses at Yale?
              <span class="text-red">*</span>
            </div>
            <SelectCourses
              keyOfFavoritesStore="selectedFavoriteCourses"
              label="Your favorite courses ever. The ones that made you think, laugh, and cry."
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              <span class="text-weight-bold">Chillest</span> courses at Yale?
              <span class="text-red">*</span>
            </div>
            <SelectCourses
              keyOfFavoritesStore="selectedGuttiestCourses"
              label="The guttiest courses you've ever taken. No stress, no worries."
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              Any remarks or words to defend your choices?
            </div>
            <q-input filled v-model="remarks" label="Your remarks." />
          </q-card-section>

          <div class="q-mt-md">
            <q-btn color="primary" label="Previous" @click="previousStep" class="q-mr-sm" />
            <q-btn color="primary" label="Next" @click="nextStep" :disable="!isStep2Valid" />
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
              <span class="text-weight-bold">{{ major.join(', ') }}</span>
              <span class="text-red">*</span>
            </div>
            <SelectCourses
              keyOfFavoritesStore="selectedFavoriteMajorCourses"
              label="The course(s) that made you fall in love with your major."
            />
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
            <SelectCourses
              keyOfFavoritesStore="selectedFavoriteDistributionalCourses"
              label="The distributional classes that you loved outside of your major."
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              Best <span class="text-weight-bold">lecture</span> courses?
            </div>
            <SelectCourses
              keyOfFavoritesStore="selectedFavoriteLectureCourses"
              label="Your favorite lecture courses of all time at Yale."
            />
          </q-card-section>

          <q-card-section>
            <div class="text-h6 text-weight-light q-mb-md">
              Best <span class="text-weight-bold">seminar</span> courses?
            </div>
            <SelectCourses
              keyOfFavoritesStore="selectedFavoriteSeminarCourses"
              label="Your favorite seminars of all time at Yale."
            />
          </q-card-section>

          <div class="q-mt-md">
            <q-btn color="primary" label="Previous" @click="previousStep" class="q-mr-sm" />
            <q-btn
              color="primary"
              label="Submit"
              @click="handleFormSubmission"
              :disable="!isStep3Valid"
              :loading="isSubmitLoading"
            />
          </div>
        </q-step-content>
      </q-step>
    </q-stepper>
  </q-page>
</template>
<script lang="ts">
export default {
  async preFetch({ store }) {
    const favoritesStore = useFavoritesStore(store);
    favoritesStore.fetchAbbreviatedCatalog();
  },
};
</script>
<script setup lang="ts">
import SelectMajor from './SelectMajor.vue';
import { useMutation } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import SelectProfessors from 'src/components/SelectProfessors.vue';
import { useFavoritesStore } from 'src/stores/favorites';
import SelectCourses from 'src/components/SelectCourses.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const favoritesStore = useFavoritesStore();
const {
  email,
  major,
  selectedFavoriteCourses,
  selectedFavoriteProfessors,
  selectedGuttiestCourses,
  selectedFavoriteMajorCourses,
  selectedFavoriteDistributionalCourses,
  selectedFavoriteLectureCourses,
  selectedFavoriteSeminarCourses,
  remarks,
} = storeToRefs(favoritesStore);

const activeStep = ref(0);

function isValidEmail(email: string) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

async function handleFormSubmission() {
  submitUserCourseMutation();
}

const router = useRouter();
const { mutate: submitUserCourseMutation, isPending: isSubmitLoading } = useMutation({
  mutationFn: () => favoritesStore.submitForm(),
  onSuccess: () => router.push('/success'),
});

const isStep1Valid = computed(() => {
  return isValidEmail(email.value) && major.value.length > 0;
});

const isStep2Valid = computed(() => {
  return (
    selectedFavoriteProfessors.value.length > 0 &&
    selectedFavoriteCourses.value.length > 0 &&
    selectedGuttiestCourses.value.length > 0
  );
});

const isStep3Valid = computed(() => {
  return (
    selectedFavoriteMajorCourses.value.length > 0 &&
    selectedFavoriteDistributionalCourses.value.length > 0
  );
});

function nextStep() {
  activeStep.value++;
}

function previousStep() {
  activeStep.value--;
}
</script>

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
