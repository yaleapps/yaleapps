import supabase from '../supabaseClient.js';

async function upsertEvaluationNarrativeBatch(evaluationNarrativesBatch) {
	const { error } = await supabase.from('EvaluationNarratives').upsert(evaluationNarrativesBatch);
	if (error) throw error;
}

export async function upsertEvaluationNarrativesInBatches(evaluationNarratives) {
	const count = evaluationNarratives.length;
	const parallelRequests = 30;
	const limit = Math.ceil(count / parallelRequests);

	try {
		const evaluationNarrativesBatches = Array.from({ length: parallelRequests }, (_, i) => {
			const start = i * limit;
			const end = start + limit;
			const evaluationNarrativesBatch = evaluationNarratives.slice(start, end);
			return evaluationNarrativesBatch;
		});
		for (const evaluationNarrativesBatch of evaluationNarrativesBatches)
			await upsertEvaluationNarrativeBatch(evaluationNarrativesBatch);
	} catch (err) {
		console.error(err);
	}
}
