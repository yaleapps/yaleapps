/**
 * Get the current hour in Eastern Time (automatically handles EDT/EST)
 */
export function getCurrentEasternHour(): number {
	return Number.parseInt(
		new Intl.DateTimeFormat("en-US", {
			timeZone: "America/New_York",
			hour: "numeric",
			hour12: false,
		}).format(new Date()),
	);
}
