import { fetchCourseTable } from '../fetchCourseTable.js';

const coursesForDisplayText = `query CoursesForDisplayText {
	computed_listing_info (distinct_on: same_course_id, where: {last_enrollment_season_code: {_gt: "201801"}}){
		all_course_codes
		title
  }
}`;

export async function getCoursesForDisplayText() {
  try {
    const courses = fetchCourseTable(coursesForDisplayText);
    return courses;
  } catch (err) {
    console.error(err);
  }
}
