import { sql } from 'drizzle-orm';
import { db } from '../db';
import { courses, evaluation_narratives } from '../schema';

/**
 * For each course, gets all the courses with matching same_course_id, then takes all the evaluations of all courses with the same_course_id, then take the average of the sentiments of the evaluations.
 * The averages are saved in the columns average_comment_neg, average_comment_neu, average_comment_pos, average_comment_compound.
 * The counts of the number of evaluations used to calculate the averages are saved in the columns average_comment_neg_n, average_comment_neu_n, average_comment_pos_n, average_comment_compound_n.
 */
export async function insertAveragesOfCommentSentimentsOfSameCourses() {
	try {
		await db.run(sql`
WITH unique_same_course_ids AS (
	SELECT
		DISTINCT same_course_id
	FROM
		${courses}
),
average_comments AS (
	SELECT
		${courses.same_course_id},
		AVG(${evaluation_narratives.comment_neg}) AS average_comment_neg,
		COUNT(${evaluation_narratives.comment_neg}) AS average_comment_neg_n,
		AVG(${evaluation_narratives.comment_neu}) AS average_comment_neu,
		COUNT(${evaluation_narratives.comment_neu}) AS average_comment_neu_n,
		AVG(${evaluation_narratives.comment_pos}) AS average_comment_pos,
		COUNT(${evaluation_narratives.comment_pos}) AS average_comment_pos_n,
		AVG(${evaluation_narratives.comment_compound}) AS average_comment_compound,
		COUNT(${evaluation_narratives.comment_compound}) AS average_comment_compound_n
	FROM
		${evaluation_narratives}
		INNER JOIN ${courses} ON ${evaluation_narratives.course_id} = ${courses.course_id}
	WHERE
		${courses.same_course_id} IN (
			SELECT
				same_course_id
			FROM
				unique_same_course_ids
		)
	GROUP BY
		${courses.same_course_id}
)
UPDATE
	${courses}
SET
	average_comment_neg = (
		SELECT
			average_comment_neg
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_neg_n = (
		SELECT
			average_comment_neg_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_neu = (
		SELECT
			average_comment_neu
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_neu_n = (
		SELECT
			average_comment_neu_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_pos = (
		SELECT
			average_comment_pos
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_pos_n = (
		SELECT
			average_comment_pos_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_compound = (
		SELECT
			average_comment_compound
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	),
	average_comment_compound_n = (
		SELECT
			average_comment_compound_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = ${courses.same_course_id}
	)
WHERE
	${courses.same_course_id} IN (
		SELECT
			same_course_id
		FROM
			unique_same_course_ids
	);
		`);
	} catch (e) {
		console.error(e);
	}
}

/**
 * @deprecated Use insertAveragesOfCommentSentimentsOfSameCourses instead, we should be taking averages across all evaluations of all courses with same_course_id, not just the evaluations of the course itself.
 * For each course, gets all of the evaluations of that course, then takes the average of the sentiments of the evaluations.
 */
export async function insertAveragesOfCommentSentimentsOfCourses() {
	try {
		await db.run(sql`WITH average_comments AS (
			SELECT
				${evaluation_narratives.course_id},
				AVG(${evaluation_narratives.comment_neg}) as average_comment_neg,
				COUNT(${evaluation_narratives.comment_neg}) as average_comment_neg_n,
				AVG(${evaluation_narratives.comment_neu}) as average_comment_neu,
				COUNT(${evaluation_narratives.comment_neu}) as average_comment_neu_n,
				AVG(${evaluation_narratives.comment_pos}) as average_comment_pos,
				COUNT(${evaluation_narratives.comment_pos}) as average_comment_pos_n,
				AVG(${evaluation_narratives.comment_compound}) as average_comment_compound,
				COUNT(${evaluation_narratives.comment_compound}) as average_comment_compound_n
			FROM ${evaluation_narratives}
			GROUP BY ${evaluation_narratives.course_id}
		)
		UPDATE ${courses}
			SET
				average_comment_neg = (SELECT average_comment_neg FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_neg_n = (SELECT average_comment_neg_n FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_neu = (SELECT average_comment_neu FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_neu_n = (SELECT average_comment_neu_n FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_pos = (SELECT average_comment_pos FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_pos_n = (SELECT average_comment_pos_n FROM average_comments WHERE ${courses.course_id} = average_comments.course_id),
				average_comment_compound = (SELECT average_comment_compound FROM average_comments WHERE ${courses.course_id} = average_comments.course_id);
				average_comment_compound_n = (SELECT average_comment_compound_n FROM average_comments WHERE ${courses.course_id} = average_comments.course_id);
		`);
	} catch (e) {
		console.error(e);
	}
}

insertAveragesOfCommentSentimentsOfSameCourses();
