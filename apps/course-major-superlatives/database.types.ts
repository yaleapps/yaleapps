import type { CourseSummary } from "src/types/types";

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
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
				Relationships: [];
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
				Relationships: [
					{
						foreignKeyName: "EvaluationNarratives_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "Courses";
						referencedColumns: ["course_id"];
					},
				];
			};
			superlatives_2023: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: number;
					major: string[] | null;
					remarks: string | null;
					selected_favorite_courses: CourseSummary[] | null;
					selected_favorite_distributional_courses: CourseSummary[] | null;
					selected_favorite_lecture_courses: CourseSummary[] | null;
					selected_favorite_major_courses: CourseSummary[] | null;
					selected_favorite_professors: string[] | null;
					selected_favorite_seminar_courses: CourseSummary[] | null;
					selected_guttiest_courses: CourseSummary[] | null;
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
				Relationships: [];
			};
		};
		Views: {
			CoursesDisplayDropdown: {
				Row: {
					all_course_codes: Json | null;
					same_course_id: number | null;
					title: string | null;
				};
				Relationships: [];
			};
			evaluationnarrativestocourses202303: {
				Row: {
					all_course_codes: Json | null;
					areas: Json | null;
					comment: string | null;
					comment_compound: number | null;
					skills: Json | null;
					title: string | null;
				};
				Relationships: [];
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
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
