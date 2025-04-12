import { fetchCourseTable } from '../fetchCourseTable.js';

const evaluationNarrativesCount = `query EvaluationNarrativesCount {
	evaluation_narratives_aggregate {
		aggregate {
			count
		}
	}
}`;

const evaluationNarratives = `query EvaluationNarratives ($limit: Int, $offset: Int) {
	evaluation_narratives (limit: $limit, offset: $offset, where: { comment_compound: { _neq: 0 } }) {
		id
		course_id
		comment
		comment_compound
	}
}`;

export async function getEvaluationNarrativesCount() {
	try {
		const {
			data: {
				evaluation_narratives_aggregate: {
					aggregate: { count }
				}
			}
		} = await fetchCourseTable(evaluationNarrativesCount);
		return count;
	} catch (err) {
		console.error(err);
	}
}

export async function getEvaluationNarratives() {
	const count = await getEvaluationNarrativesCount();
	const parallelRequests = 4;
	const limit = Math.ceil(count / parallelRequests);

	try {
		const requests = Array.from({ length: parallelRequests }, (_, i) => i * limit).map((offset) =>
			fetchCourseTable(evaluationNarratives, { limit, offset })
		);
		const results = await Promise.all(requests);
		const courses = results.flatMap((result) => result.data.evaluation_narratives);
		return courses;
	} catch (err) {
		console.error(err);
	}
}
