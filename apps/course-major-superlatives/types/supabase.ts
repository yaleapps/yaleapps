export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
      };
      Courses: {
        Row: {
          all_course_codes: Json | null;
          areas: Json | null;
          average_gut_rating: number | null;
          average_professor: number | null;
          average_rating: number | null;
          average_rating_same_professors: number | null;
          average_workload: number | null;
          average_workload_same_professors: number | null;
          classnotes: string | null;
          course_code: string | null;
          course_id: number;
          credits: number | null;
          description: string | null;
          final_exam: string | null;
          flag_info: Json | null;
          locations_summary: string | null;
          number: string | null;
          professor_names: Json | null;
          regnotes: string | null;
          requirements: string | null;
          same_course_id: number | null;
          school: string | null;
          season_code: string | null;
          section: string | null;
          skills: Json | null;
          times_summary: string | null;
          title: string | null;
        };
        Insert: {
          all_course_codes?: Json | null;
          areas?: Json | null;
          average_gut_rating?: number | null;
          average_professor?: number | null;
          average_rating?: number | null;
          average_rating_same_professors?: number | null;
          average_workload?: number | null;
          average_workload_same_professors?: number | null;
          classnotes?: string | null;
          course_code?: string | null;
          course_id: number;
          credits?: number | null;
          description?: string | null;
          final_exam?: string | null;
          flag_info?: Json | null;
          locations_summary?: string | null;
          number?: string | null;
          professor_names?: Json | null;
          regnotes?: string | null;
          requirements?: string | null;
          same_course_id?: number | null;
          school?: string | null;
          season_code?: string | null;
          section?: string | null;
          skills?: Json | null;
          times_summary?: string | null;
          title?: string | null;
        };
        Update: {
          all_course_codes?: Json | null;
          areas?: Json | null;
          average_gut_rating?: number | null;
          average_professor?: number | null;
          average_rating?: number | null;
          average_rating_same_professors?: number | null;
          average_workload?: number | null;
          average_workload_same_professors?: number | null;
          classnotes?: string | null;
          course_code?: string | null;
          course_id?: number;
          credits?: number | null;
          description?: string | null;
          final_exam?: string | null;
          flag_info?: Json | null;
          locations_summary?: string | null;
          number?: string | null;
          professor_names?: Json | null;
          regnotes?: string | null;
          requirements?: string | null;
          same_course_id?: number | null;
          school?: string | null;
          season_code?: string | null;
          section?: string | null;
          skills?: Json | null;
          times_summary?: string | null;
          title?: string | null;
        };
      };
      EvaluationNarratives: {
        Row: {
          comment: string;
          comment_compound: number;
          course_id: number;
          id: number;
        };
        Insert: {
          comment: string;
          comment_compound: number;
          course_id: number;
          id: number;
        };
        Update: {
          comment?: string;
          comment_compound?: number;
          course_id?: number;
          id?: number;
        };
      };
      UserCourse: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: number;
          major: Json | null;
          remarks: string | null;
          selected_favorite_courses: Json | null;
          selected_favorite_distributional_courses: Json | null;
          selected_favorite_lecture_courses: Json | null;
          selected_favorite_major_courses: Json | null;
          selected_favorite_professors: Json | null;
          selected_favorite_seminar_courses: Json | null;
          selected_guttiest_courses: Json | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          major?: Json | null;
          remarks?: string | null;
          selected_favorite_courses?: Json | null;
          selected_favorite_distributional_courses?: Json | null;
          selected_favorite_lecture_courses?: Json | null;
          selected_favorite_major_courses?: Json | null;
          selected_favorite_professors?: Json | null;
          selected_favorite_seminar_courses?: Json | null;
          selected_guttiest_courses?: Json | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          major?: Json | null;
          remarks?: string | null;
          selected_favorite_courses?: Json | null;
          selected_favorite_distributional_courses?: Json | null;
          selected_favorite_lecture_courses?: Json | null;
          selected_favorite_major_courses?: Json | null;
          selected_favorite_professors?: Json | null;
          selected_favorite_seminar_courses?: Json | null;
          selected_guttiest_courses?: Json | null;
        };
      };
    };
    Views: {
      CoursesDisplayDropdown: {
        Row: {
          all_course_codes: Json | null;
          same_course_id: number | null;
          title: string | null;
        };
      };
      EvaluationNarrativesToCourses202303: {
        Row: {
          all_course_codes: Json | null;
          areas: Json | null;
          comment: string | null;
          comment_compound: number | null;
          skills: Json | null;
          title: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
