import type { GoogleCalendarService } from "./calendar";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

export type ButteryOpenStatus = ReturnType<
	ButteryScheduleService["getButteryOpenStatus"]
>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		getButteryOpenStatus: async () => {
			try {
				const ongoingShift = await googleCalendarService.getOngoingEvent();
				if (ongoingShift) {
					if (ongoingShift.summary?.startsWith("[CLOSED]")) {
						return "SHOULD_BE_OPEN_NOW/CONFIRMED_CLOSED";
					}
					if (ongoingShift.summary?.startsWith("[OPEN]")) {
						return "SHOULD_BE_OPEN_NOW/CONFIRMED_OPEN";
					}
					return "SHOULD_BE_OPEN_NOW";
				}
				const nextShift =
					await googleCalendarService.getNextEventBeforeTomorrow();
				if (!nextShift) return "SHOULD_BE_CLOSED_TODAY";
				if (nextShift.summary?.startsWith("[CLOSED]")) {
					return "SHOULD_BE_OPEN_TODAY/CONFIRMED_CLOSED";
				}
				if (nextShift.summary?.startsWith("[OPEN]")) {
					return "SHOULD_BE_OPEN_TODAY/CONFIRMED_OPEN";
				}
				return "SHOULD_BE_OPEN_TODAY";
			} catch (error) {
				return "SHOULD_BE_CLOSED_TODAY";
			}
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;
			try {
				const nextEvent = await googleCalendarService.getOngoingEvent();
				if (
					!nextEvent?.id ||
					nextEvent.summary === null ||
					nextEvent.summary === undefined
				) {
					throw new Error("No upcoming events found");
				}

				const summaryWithoutPrefix = nextEvent.summary
					?.replace(STATUS_PREFIXES.OPEN, "")
					.replace(STATUS_PREFIXES.CLOSED, "");

				switch (status) {
					case "OPEN": {
						const updatedEvent = await googleCalendarService.updateEvent(
							nextEvent.id,
							{
								...nextEvent,
								summary: `${STATUS_PREFIXES.OPEN}${summaryWithoutPrefix}`,
							},
						);
						return updatedEvent;
					}
					case "CLOSED": {
						const updatedEvent = await googleCalendarService.updateEvent(
							nextEvent.id,
							{
								...nextEvent,
								summary: `${STATUS_PREFIXES.CLOSED}${summaryWithoutPrefix}`,
							},
						);
						return updatedEvent;
					}
				}
			} catch (error) {
				throw new Error(`Error marking next shift as ${status}: ${error}`);
			}
		},
	};
}
