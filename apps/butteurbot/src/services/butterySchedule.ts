import { isWithinInterval, subHours, addHours, isToday } from "date-fns";
import type { GoogleCalendarService } from "./calendar";
import { tz, TZDate } from "@date-fns/tz";
import { getMessageFromUnknownError } from "../utils";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

type ButteryScheduleStatus =
	| "NOW/SHOULD_BE_OPEN"
	| "NOW/SHOULD_BE_OPEN/CONFIRMED_OPEN"
	| "NOW/SHOULD_BE_OPEN/CONFIRMED_CLOSED"
	| "TODAY/SHOULD_BE_OPEN"
	| "TODAY/SHOULD_BE_CLOSED"
	| "TODAY/SHOULD_BE_OPEN/CONFIRMED_OPEN"
	| "TODAY/SHOULD_BE_OPEN/CONFIRMED_CLOSED";

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		isOpen: async (): Promise<ButteryScheduleStatus> => {
			try {
				const ongoingShift = await googleCalendarService.getOngoingEvent();
				if (ongoingShift) {
					if (ongoingShift.summary?.startsWith("[CLOSED]")) {
						return "NOW/SHOULD_BE_OPEN/CONFIRMED_CLOSED";
					}
					if (ongoingShift.summary?.startsWith("[OPEN]")) {
						return "NOW/SHOULD_BE_OPEN/CONFIRMED_OPEN";
					}
					return "NOW/SHOULD_BE_OPEN";
				}
				const nextShift =
					await googleCalendarService.getNextEventBeforeTomorrow();
				if (!nextShift) return "TODAY/SHOULD_BE_CLOSED";
				if (nextShift.summary?.startsWith("[CLOSED]")) {
					return "TODAY/SHOULD_BE_OPEN/CONFIRMED_CLOSED";
				}
				if (nextShift.summary?.startsWith("[OPEN]")) {
					return "TODAY/SHOULD_BE_OPEN/CONFIRMED_OPEN";
				}
				return "TODAY/SHOULD_BE_OPEN";
			} catch (error) {
				return "TODAY/SHOULD_BE_CLOSED";
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
