import { z } from 'zod';

type Year = `${number}${number}${number}${number}`;
type Season = '01' | '02' | '03';

export type SeasonCode = `${Year}${Season}`;

export const seasonCodeSchema = z
	.string({ required_error: 'Please select a season.' })
	.refine((value): value is SeasonCode => {
		const regex = /^\d{4}(01|02|03)$/;
		return regex.test(value);
	});
