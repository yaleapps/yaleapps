import type { CourseAbbreviated } from 'src/stores/favorites';

export function getDisplayText(course: CourseAbbreviated) {
  return `${course.all_course_codes.join(' | ')} | ${course.title}`;
}
