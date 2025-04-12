<template>
  <q-select
    v-model="major"
    label="Major(s)"
    :options="options"
    multiple
    use-input
    use-chips
    filled
    menu-self="top middle"
    menu-anchor="bottom middle"
    @filter="filterFn"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { QSelectProps } from 'quasar';
import { useFavoritesStore } from 'src/stores/favorites';
import { ref } from 'vue';

const majors = [
  'African American Studies (B.A.)',
  'African Studies (B.A.)',
  'American Studies (B.A.)',
  'Anthropology (B.A.)',
  'Applied Mathematics (B.A. or B.S.)',
  'Applied Physics (B.S.)',
  'Archaeological Studies (B.A.)',
  'Architecture (B.A.)',
  'Art (B.A.)',
  'Astronomy (B.A.)',
  'Astrophysics (B.S.)',
  'Biomedical Engineering (B.S.)',
  'Chemical Engineering (B.S.)',
  'Chemistry (B.A. or B.S.)',
  'Classical Civilization (B.A.)',
  'Classics (B.A.)',
  'Cognitive Science (B.A. or B.S.)',
  'Comparative Literature (B.A.)',
  'Computer Science (B.A. or B.S.)',
  'Computer Science and Economics (B.S.)',
  'Computer Science and Mathematics (B.S.)',
  'Computer Science and Psychology (B.A.)',
  'Computing and Linguistics (B.A. or B.S.)',
  'Computing and the Arts (B.A.)',
  'Earth and Planetary Sciences (B.A. or B.S.)',
  'East Asian Languages and Literatures (B.A.)',
  'East Asian Studies (B.A.)',
  'Ecology and Evolutionary Biology (B.A. or B.S.)',
  'Economics (B.A.)',
  'Economics and Mathematics (B.A.)',
  'Electrical Engineering (B.S.)',
  'Electrical Engineering and Computer Science (B.S.)',
  'Engineering Sciences (Chemical) (B.S.)',
  'Engineering Sciences (Electrical) (B.A. or B.S.)',
  'Engineering Sciences (Environmental) (B.A.)',
  'Engineering Sciences (Mechanical) (B.A. or B.S.)',
  'English (B.A.)',
  'Environmental Engineering (B.S.)',
  'Environmental Studies (B.A. or B.S.)',
  'Ethics, Politics, and Economics (B.A.)',
  'Ethnicity, Race, and Migration (B.A.)',
  'Film and Media Studies (B.A.)',
  'French (B.A.)',
  'German Studies (B.A.)',
  'Global Affairs (B.A.)',
  'Greek, Ancient and Modern (B.A.)',
  'History (B.A.)',
  'History of Art (B.A.)',
  'History of Science, Medicine, and Public Health (B.A.)',
  'Humanities (B.A.)',
  'Italian Studies (B.A.)',
  'Judaic Studies (B.A.)',
  'Latin American Studies (B.A.)',
  'Linguistics (B.A.)',
  'Mathematics (B.A. or B.S.)',
  'Mathematics and Philosophy (B.A.)',
  'Mathematics and Physics (B.S.)',
  'Mechanical Engineering (B.S.)',
  'Modern Middle East Studies (B.A.)',
  'Molecular Biophysics and Biochemistry (B.A. or B.S.)',
  'Molecular, Cellular, and Developmental Biology (B.A. or B.S.)',
  'Music (B.A.)',
  'Near Eastern Languages and Civilizations (B.A.)',
  'Neuroscience (B.A. or B.S.)',
  'Philosophy (B.A.)',
  'Physics (B.S.)',
  'Physics and Geosciences (B.S.)',
  'Physics and Philosophy (B.A. or B.S.)',
  'Political Science (B.A.)',
  'Portuguese (B.A.)',
  'Psychology (B.A. or B.S.)',
  'Religious Studies (B.A.)',
  'Russian (B.A.)',
  'Russian, East European, and Eurasian Studies (B.A.)',
  'Sociology (B.A.)',
  'South Asian Studies (second major only)',
  'Spanish (B.A.)',
  'Special Divisional Major (B.A. or B.S.)',
  'Statistics and Data Science (B.A. or B.S.)',
  'Theater and Performance Studies (B.A.)',
  'Urban Studies (B.A.)',
  'Women’s, Gender, and Sexuality Studies (B.A.)',
  'Other',
];

const favoritesStore = useFavoritesStore();
const { major } = storeToRefs(favoritesStore);

const options = ref(majors);
const filterFn: QSelectProps['onFilter'] = (val, update) => {
  update(
    () => {
      options.value = majors.filter((i) => {
        return i.toLowerCase().includes(val.toLowerCase());
      });
    },
    (ref) => {
      ref.setOptionIndex(-1);
      ref.moveOptionSelection(1, true);
    },
  );
};
</script>
