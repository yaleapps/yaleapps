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

export function getMessageFromUnknownError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unknown error occurred";
}
