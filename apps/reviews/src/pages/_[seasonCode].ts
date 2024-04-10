import { db } from '@repo/db/courses';
import { z } from 'zod';

type Year = `${number}${number}${number}${number}`;
type Season = '01' | '02' | '03';
type SeasonCode = `${Year}${Season}`;
export type DisplayCourse = Awaited<ReturnType<typeof getCoursesBySeason>>[number];

export const seasonCodeSchema = z
	.string({ required_error: 'Please select a season.' })
	.refine((value): value is SeasonCode => {
		const regex = /^\d{4}(01|02|03)$/;
		return regex.test(value);
	});

export async function getCoursesBySeason(seasonCode: SeasonCode) {
	const allCourses = await db.query.courses.findMany({
		where: (courses, { eq }) => eq(courses.season_code, seasonCode),
		columns: {
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
					course_id: true,
					school: true,
					subject: true,
					season_code: true,
					crn: true,
				},
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
		limit: 10,
	});
	return allCourses;
}
