import { db } from '@repo/db/courses';
import type { SeasonCode } from '../_types';

export async function getFtsCourses({
	seasonCode,
	keyword,
}: {
	seasonCode: SeasonCode;
	keyword: string;
}) {
	const allCourses = await db.query.courses.findMany({
		where: (courses, { eq }) => eq(courses.season_code, seasonCode),
		columns: {
			season_code: true,
			course_id: true,
			title: true,
			description: true,
			areas: true,
			skills: true,
			last_enrollment: true,
			average_rating: true,
			average_workload: true,
			average_comment_pos: true,
			average_comment_neu: true,
			average_comment_neg: true,
			average_comment_compound: true,
		},
		with: {
			listings: {
				columns: {
					course_code: true,
					school: true,
					subject: true,
					crn: true,
				},
			},
			evaluationNarratives: {
				columns: {
					comment: true,
					comment_pos: true,
					comment_neu: true,
					comment_neg: true,
					comment_compound: true,
				},
				where: (evaluationNarratives, { like }) =>
					like(evaluationNarratives.comment, `%${keyword}%`),
			},
			courseProfessors: {
				with: {
					professor: {
						columns: {
							name: true,
							average_rating: true,
						},
					},
				},
			},
		},
		limit: 1000,
	});
	return allCourses;
}

export type FtsCourse = Awaited<ReturnType<typeof getFtsCourses>>[number];
