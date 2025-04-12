export interface CourseFromApi {
  all_course_codes: string[];
  areas: Area[];
  average_gut_rating: number | null;
  average_professor: number | null;
  average_rating: number | null;
  average_workload: number | null;
  average_rating_same_professors: number | null;
  average_workload_same_professors: number | null;
  classnotes: null | string;
  course_code: string;
  course_id: number;
  credits: number;
  crn: number;
  description: null | string;
  enrolled: null;
  extra_info: ExtraInfo;
  final_exam: string | null;
  flag_info: string[];
  fysem: boolean;
  last_enrollment: number | null;
  last_enrollment_same_professors: boolean | null;
  listing_id: number;
  locations_summary: string;
  number: string;
  professor_ids: string[];
  professor_names: string[];
  regnotes: null | string;
  requirements: null | string;
  rp_attr: null | string;
  same_course_id: number;
  same_course_and_profs_id: number;
  last_offered_course_id: number | null;
  school: School;
  season_code: string;
  section: string;
  skills: Skill[];
  subject: string;
  syllabus_url: null | string;
  times_by_day: TimesByDay;
  times_summary: string;
  title: string;
}

export enum Area {
  Hu = 'Hu',
  Sc = 'Sc',
  So = 'So',
}

export enum ExtraInfo {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
}

export enum School {
  AC = 'AC',
  At = 'AT',
  DR = 'DR',
  Di = 'DI',
  FS = 'FS',
  GB = 'GB',
  Gs = 'GS',
  Lw = 'LW',
  Mg = 'MG',
  Mu = 'MU',
  Nr = 'NR',
  Pa = 'PA',
  Ph = 'PH',
  Su = 'SU',
  Yc = 'YC',
}

export enum Skill {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
  Qr = 'QR',
  Wr = 'WR',
}

export interface TimesByDay {
  Monday?: Array<string[]>;
  Tuesday?: Array<string[]>;
  Wednesday?: Array<string[]>;
  Thursday?: Array<string[]>;
  Friday?: Array<string[]>;
  Saturday?: Array<string[]>;
}
