/**
 * Yale season codes are constructed as YYYY0S where:
 * YYYY = Academic year
 * S = Season (1 = Spring, 2 = Summer, 3 = Fall)
 *
 * Rough month ranges:
 * Spring (01): January - May
 * Summer (02): June - July
 * Fall (03): August - December
 */

/**
 * Gets the current Yale season code based on the month
 * @returns string in format YYYY0S (e.g. "202501" for Spring 2025)
 */
export function getSeasonCodeForDate(date: Date): string {
	const month = date.getMonth();
	const year = date.getFullYear();

	// Determine season number (1=Spring, 2=Summer, 3=Fall)
	let seasonNumber: number;

	if (month <= 4) {
		// January (0) through May (4)
		seasonNumber = 1; // Spring
	} else if (month <= 6) {
		// June (5) through July (6)
		seasonNumber = 2; // Summer
	} else {
		// August (7) through December (11)
		seasonNumber = 3; // Fall
	}

	return `${year}0${seasonNumber}` as const;
}
