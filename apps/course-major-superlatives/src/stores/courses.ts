import { defineStore } from 'pinia';
import { supabase } from 'src/supabase';
import type { CourseFromSupabase } from 'src/types/courseFromSupabase';

type Column = {
  name: keyof CourseFromSupabase;
  label: string;
  field: string;
  sortable: boolean;
  align: 'left' | 'right' | 'center';
};

const defaultToggledColumns: (keyof CourseFromSupabase)[] = [
  'all_course_codes',
  'title',
  'average_rating',
  'average_rating_same_professors',
  'average_workload',
  'average_workload_same_professors',
  'average_gut_rating',
  'average_professor',
  'areas',
  'skills',
  'classnotes',
  'course_id',
  'credits',
  'description',
  'final_exam',
  'flag_info',
  'locations_summary',
  'number',
  'professor_names',
  'regnotes',
  'requirements',
  'same_course_id',
  'section',
  'school',
  'season_code',
  'times_summary',
];

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    toggledColumns: defaultToggledColumns,
    filter: '',
    pagination: { rowsPerPage: 0 },
  }),
  getters: {
    columns: (state) =>
      state.toggledColumns.map(
        (key): Column => ({
          name: key,
          label: keyToLabel(key),
          field: key,
          sortable: true,
          align: 'left',
        }),
      ),
  },
  actions: {
    async fetchCatalog() {
      const { data, error } = await supabase
        .from('Courses')
        .select(this.toggledColumns.join(','))
        .eq('season_code', '202303');
      // .limit(10);
      this.courses = data;
    },
  },
});

// Takes in string like "times_by_day" and returns "Times by Day"
function keyToLabel(label: string) {
  return label
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
