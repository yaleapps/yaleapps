import { TZDate, tz } from "@date-fns/tz";
import type { calendar_v3 } from "@googleapis/calendar";
import { addHours, isWithinInterval, subHours } from "date-fns";
import { getMessageFromUnknownError } from "../utils";

const MAX_BUTTERY_SHIFT_HOURS = 3;

import type { GoogleCalendarService } from "./calendar";

export type ButteryScheduleService = ReturnType<
	typeof createButteryScheduleService
>;

export type ButteryOpenStatus = Awaited<
	ReturnType<ButteryScheduleService["getButteryOpenStatus"]>
>;

export function createButteryScheduleService(
	googleCalendarService: GoogleCalendarService,
) {
	const getOngoingOrTodayShift =
		async (): Promise<calendar_v3.Schema$Event | null> => {
			try {
				const { items: shifts } = await googleCalendarService.listEvents({
					timeMin: new Date().toISOString(),
					timeMax: addHours(
						new Date(),
						24 - MAX_BUTTERY_SHIFT_HOURS,
					).toISOString(),
					maxResults: 1,
					singleEvents: true,
					orderBy: "startTime",
				});
				const maybeOngoingOrTodayShift = shifts?.at(0);
				if (!maybeOngoingOrTodayShift) return null;
				const ongoingOrTodayShift = maybeOngoingOrTodayShift;
				return ongoingOrTodayShift;
			} catch (error) {
				throw new Error(
					`Failed to get next event: ${getMessageFromUnknownError(error)}`,
				);
			}
		};
	return {
		getButteryOpenStatus: async (): Promise<
			| "NOW/CONFIRMED_CLOSED"
			| "NOW/CONFIRMED_OPEN"
			| "NOW/UNCONFIRMED"
			| "TODAY/CONFIRMED_CLOSED"
			| "TODAY/CONFIRMED_OPEN"
			| "TODAY/UNCONFIRMED"
		> => {
			try {
				const ongoingOrTodayShift = await getOngoingOrTodayShift();
				if (
					!ongoingOrTodayShift ||
					!ongoingOrTodayShift.start?.dateTime ||
					!ongoingOrTodayShift.end?.dateTime
				)
					return "TODAY/CONFIRMED_CLOSED";
				const isOngoing = isWithinInterval(new Date(), {
					start: new Date(ongoingOrTodayShift.start.dateTime),
					end: new Date(ongoingOrTodayShift.end.dateTime),
				});
				if (isOngoing) {
					if (ongoingOrTodayShift.summary?.startsWith("[CLOSED]")) {
						return "NOW/CONFIRMED_CLOSED";
					}
					if (ongoingOrTodayShift.summary?.startsWith("[OPEN]")) {
						return "NOW/CONFIRMED_OPEN";
					}
					return "NOW/UNCONFIRMED";
				}
				if (ongoingOrTodayShift.summary?.startsWith("[CLOSED]")) {
					return "TODAY/CONFIRMED_CLOSED";
				}
				if (ongoingOrTodayShift.summary?.startsWith("[OPEN]")) {
					return "TODAY/CONFIRMED_OPEN";
				}
				return "TODAY/UNCONFIRMED";
			} catch (error) {
				throw new Error(`Error getting buttery open status: ${error}`);
			}
		},
		markNextShiftAs: async (status: "OPEN" | "CLOSED") => {
			const STATUS_PREFIXES = { OPEN: "[OPEN] ", CLOSED: "[CLOSED] " } as const;
			try {
				const ongoingOrTodayShift = await getOngoingOrTodayShift();
				if (
					!ongoingOrTodayShift?.id ||
					ongoingOrTodayShift.summary === null ||
					ongoingOrTodayShift.summary === undefined
				) {
					throw new Error("No upcoming events found");
				}

				const summaryWithoutPrefix = ongoingOrTodayShift.summary
					?.replace(STATUS_PREFIXES.OPEN, "")
					.replace(STATUS_PREFIXES.CLOSED, "");

				switch (status) {
					case "OPEN": {
						const updatedEvent = await googleCalendarService.updateEvent(
							ongoingOrTodayShift.id,
							{
								...ongoingOrTodayShift,
								summary: `${STATUS_PREFIXES.OPEN}${summaryWithoutPrefix}`,
							},
						);
						return updatedEvent;
					}
					case "CLOSED": {
						const updatedEvent = await googleCalendarService.updateEvent(
							ongoingOrTodayShift.id,
							{
								...ongoingOrTodayShift,
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
