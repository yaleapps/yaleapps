import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const { PUBLIC_COURSETABLE_COOKIE } = process.env;

export async function fetchCourseTable(query, variables = {}) {
	const url = 'https://api.coursetable.com/ferry/v1/graphql';

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: PUBLIC_COURSETABLE_COOKIE
		},
		body: JSON.stringify({ query, variables })
	};

	const response = await fetch(url, options);
	const data = await response.json();

	return data;
}
