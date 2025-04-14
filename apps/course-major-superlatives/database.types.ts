import type { CourseSummary, Professor } from "src/types/types";

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
			superlatives_2023: {
				Row: {
					created_at: string | null;
					email: string;
					id: number;
					major: string[];
					remarks: string | null;
					selected_favorite_courses: CourseSummary[];
					selected_favorite_distributional_courses: CourseSummary[];
					selected_favorite_lecture_courses: CourseSummary[];
					selected_favorite_major_courses: CourseSummary[];
					selected_favorite_professors: Professor[];
					selected_favorite_seminar_courses: CourseSummary[];
					selected_guttiest_courses: CourseSummary[];
				};
				Insert: {
					created_at?: string | null;
					email: string;
					id?: number;
					major: string[];
					remarks?: string | null;
					selected_favorite_courses: CourseSummary[];
					selected_favorite_distributional_courses: CourseSummary[];
					selected_favorite_lecture_courses: CourseSummary[];
					selected_favorite_major_courses: CourseSummary[];
					selected_favorite_professors: Professor[];
					selected_favorite_seminar_courses: CourseSummary[];
					selected_guttiest_courses: CourseSummary[];
				};
				Update: {
					created_at?: string | null;
					email?: string;
					id?: number;
					major?: string[];
					remarks?: string | null;
					selected_favorite_courses?: CourseSummary[];
					selected_favorite_distributional_courses?: CourseSummary[];
					selected_favorite_lecture_courses?: CourseSummary[];
					selected_favorite_major_courses?: CourseSummary[];
					selected_favorite_professors?: CourseSummary[];
					selected_favorite_seminar_courses?: CourseSummary[];
					selected_guttiest_courses?: CourseSummary[];
				};
				Relationships: [];
			};
			superlatives_2025: {
				Row: {
					class_year: string;
					created_at: string | null;
					email: string;
					id: number;
					major: string[];
					remarks: string | null;
					residential_college: string;
					selected_favorite_courses: CourseSummary[];
					selected_favorite_distributional_courses: CourseSummary[];
					selected_favorite_major_courses: Record<string, CourseSummary[]>;
					selected_favorite_professors: Professor[];
					selected_guttiest_courses: CourseSummary[];
					selected_major_satisfaction: Record<string, number>;
					selected_quintessentially_yale_course: CourseSummary[];
					selected_regretted_courses: CourseSummary[];
				};
				Insert: {
					class_year: string;
					created_at?: string | null;
					email: string;
					id?: number;
					major: string[];
					remarks?: string | null;
					residential_college: string;
					selected_favorite_courses: CourseSummary[];
					selected_favorite_distributional_courses: CourseSummary[];
					selected_favorite_major_courses: Record<string, CourseSummary[]>;
					selected_favorite_professors: Professor[];
					selected_guttiest_courses: CourseSummary[];
					selected_major_satisfaction: Record<string, number>;
					selected_quintessentially_yale_course: CourseSummary[];
					selected_regretted_courses: CourseSummary[];
				};
				Update: {
					class_year?: string;
					created_at?: string | null;
					email?: string;
					id?: number;
					major?: string[];
					remarks?: string | null;
					residential_college?: string;
					selected_favorite_courses?: CourseSummary[];
					selected_favorite_distributional_courses?: CourseSummary[];
					selected_favorite_major_courses?: Record<string, CourseSummary[]> ;
					selected_favorite_professors?: Professor[];
					selected_guttiest_courses?: CourseSummary[];
					selected_major_satisfaction?: Record<string, number>;
					selected_quintessentially_yale_course?: CourseSummary[];
					selected_regretted_courses?: CourseSummary[];
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
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
