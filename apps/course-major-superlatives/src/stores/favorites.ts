import { defineStore } from 'pinia';
import { supabase } from 'src/supabase';
import type { CourseFromSupabase } from 'src/types/courseFromSupabase';
import { getDisplayText } from 'src/utils/getDisplayText';

export type CourseAbbreviated = Pick<
  CourseFromSupabase,
  'same_course_id' | 'all_course_codes' | 'title'
>;

const selectedColumns: (keyof CourseAbbreviated)[] = [
  'same_course_id',
  'all_course_codes',
  'title',
];

export const useFavoritesStore = defineStore('courses', {
  state: () => ({
    courses: [] as CourseAbbreviated[],
    email: '',
    major: [] as string[],
    selectedFavoriteProfessors: [] as string[],
    selectedFavoriteCourses: [] as CourseAbbreviated[],
    selectedGuttiestCourses: [] as CourseAbbreviated[],
    selectedFavoriteMajorCourses: [] as CourseAbbreviated[],
    selectedFavoriteDistributionalCourses: [] as CourseAbbreviated[],
    selectedFavoriteLectureCourses: [] as CourseAbbreviated[],
    selectedFavoriteSeminarCourses: [] as CourseAbbreviated[],
    remarks: '',
  }),
  actions: {
    async fetchAbbreviatedCatalog() {
      // const { data, error } = await supabase
      //   .from('Courses')
      //   .select(selectedColumns.join(','))
      //   .gt('season_code', '202003');

      // Fetch json from 'https://qgwabimelbyerzbvkngr.supabase.co/storage/v1/object/public/json_views/CoursesDisplayDropdown.json'
      const response = await fetch(
        'https://qgwabimelbyerzbvkngr.supabase.co/storage/v1/object/public/json_views/CoursesDisplayDropdown.json',
      );
      const data = await response.json();
      this.courses = data;
    },
    async submitForm() {
      const { error } = await supabase.from('UserCourse').insert({
        email: this.email,
        major: this.major,
        selected_favorite_professors: this.selectedFavoriteProfessors,
        selected_favorite_courses: this.selectedFavoriteCourses,
        selected_guttiest_courses: this.selectedGuttiestCourses,
        selected_favorite_major_courses: this.selectedFavoriteMajorCourses,
        selected_favorite_distributional_courses: this.selectedFavoriteDistributionalCourses,
        selected_favorite_lecture_courses: this.selectedFavoriteLectureCourses,
        selected_favorite_seminar_courses: this.selectedFavoriteSeminarCourses,
        remarks: this.remarks,
      });
    },
  },
});
