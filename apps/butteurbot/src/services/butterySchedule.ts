import { isWithinInterval, subHours, addHours, isToday } from "date-fns";
import type { GoogleCalendarService } from "./calendar";
import { tz, TZDate } from "@date-fns/tz";
import { getMessageFromUnknownError } from "../utils";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	return {
		isOpenNow: async (): Promise<
			| "The buttery is confirmed open now!"
			| "The buttery is confirmed closed now!"
			| "The buttery should be open now according to the Buttery schedule (awaiting confirmation)!"
			| "The buttery should be closed now according to the Buttery schedule!"
		> => {
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

			if (!isShiftRightNow) {
				return "The buttery should be closed now according to the Buttery schedule!";
			}

			const getShouldBeOpenStatus = () => {
				if (ongoingOrNextShift.summary?.startsWith("[CLOSED]")) {
					return "The buttery is confirmed closed now!";
				}
				if (ongoingOrNextShift.summary?.startsWith("[OPEN]")) {
					return "The buttery is confirmed open now!";
				}
				return "The buttery should be open now according to the Buttery schedule (awaiting confirmation)!";
			};

			return getShouldBeOpenStatus();
		},
		isOpenToday: async (): Promise<
			| "The buttery is confirmed open today!"
			| "The buttery is confirmed closed today!"
			| "The buttery should be open today according to the Buttery schedule (awaiting confirmation by managers)"
			| "The buttery should be closed today according to the Buttery schedule"
		> => {
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

				if (!isShiftTodayExists)
					return "The buttery should be closed today according to the Buttery schedule";

				return "The buttery should be open today according to the Buttery schedule (awaiting confirmation by managers)";
			} catch (error) {
				return "The buttery should be closed today according to the Buttery schedule";
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
