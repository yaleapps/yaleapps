import { isWithinInterval, subHours, addHours, isToday } from "date-fns";
import type { GoogleCalendarService } from "./calendar";
import { tz, TZDate } from "@date-fns/tz";
import { getMessageFromUnknownError } from "../utils";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

type ButteryScheduleStatus =
	| "SHOULD_BE_OPEN"
	| "SHOULD_BE_CLOSED"
	| "SHOULD_BE_OPEN_CONFIRMED_OPEN"
	| "SHOULD_BE_OPEN_CONFIRMED_CLOSED";

const butteryScheduleStatusToMessage = {
	SHOULD_BE_OPEN:
		"The buttery should be open now according to the Buttery schedule!",
	SHOULD_BE_CLOSED:
		"The buttery should be closed now according to the Buttery schedule!",
	SHOULD_BE_OPEN_CONFIRMED_OPEN: "The buttery is confirmed open now!",
	SHOULD_BE_OPEN_CONFIRMED_CLOSED: "The buttery is confirmed closed now!",
} satisfies Record<ButteryScheduleStatus, string>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		isOpenNow: async (): Promise<ButteryScheduleStatus> => {
			try {
				const ongoingOrNextShift =
					await googleCalendarService.getOngoingOrNextEvent();
				if (
					!ongoingOrNextShift?.start?.dateTime ||
					!ongoingOrNextShift?.end?.dateTime
				) {
					throw new Error("No upcoming events found");
				}

				const now = new Date();

				const isShiftRightNow = isWithinInterval(
					now,
					{
						start: new Date(ongoingOrNextShift.start?.dateTime),
						end: new Date(ongoingOrNextShift.end?.dateTime),
					},
					{ in: tz("America/New_York") },
				);

				if (!isShiftRightNow) return "SHOULD_BE_CLOSED";
				if (ongoingOrNextShift.summary?.startsWith("[CLOSED]")) {
					return "SHOULD_BE_OPEN_CONFIRMED_CLOSED";
				}
				if (ongoingOrNextShift.summary?.startsWith("[OPEN]")) {
					return "SHOULD_BE_OPEN_CONFIRMED_OPEN";
				}
				return "SHOULD_BE_OPEN";
			} catch (error) {
				return "SHOULD_BE_CLOSED";
			}
		},
		isOpenToday: async (): Promise<ButteryScheduleStatus> => {
			try {
				const ongoingOrNextShift =
					await googleCalendarService.getOngoingOrNextEvent();
				if (!ongoingOrNextShift?.start?.dateTime)
					throw new Error("No upcoming events found");

				const ongoingOrNextShiftStart = new Date(
					ongoingOrNextShift.start?.dateTime,
				);
				const isShiftTodayExists = isToday(ongoingOrNextShiftStart, {
					in: tz("America/New_York"),
				});

				if (!isShiftTodayExists) return "SHOULD_BE_CLOSED";

				if (ongoingOrNextShift.summary?.startsWith("[CLOSED]")) {
					return "SHOULD_BE_OPEN_CONFIRMED_CLOSED";
				}
				if (ongoingOrNextShift.summary?.startsWith("[OPEN]")) {
					return "SHOULD_BE_OPEN_CONFIRMED_OPEN";
				}
				return "SHOULD_BE_OPEN";
			} catch (error) {
				return "SHOULD_BE_CLOSED";
			}
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;
			try {
				const nextEvent = await googleCalendarService.getOngoingOrNextEvent();
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
