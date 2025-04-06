// https://catalog.yale.edu/ycps/building-abbreviations/
export const RESIDENTIAL_COLLEGES = [
	{
		name: "Benjamin Franklin",
		abbreviation: "BF",
	},
	{
		name: "Berkeley",
		abbreviation: "BK",
	},
	{
		name: "Branford",
		abbreviation: "BR",
	},
	{
		name: "Davenport",
		abbreviation: "DC",
	},
	{
		name: "Ezra Stiles",
		abbreviation: "ES",
	},
	{
		name: "Grace Hopper",
		abbreviation: "GH",
	},
	{
		name: "Jonathan Edwards",
		abbreviation: "JE",
	},
	{
		name: "Morse",
		abbreviation: "MC",
	},
	{
		name: "Pauli Murray",
		abbreviation: "MY",
	},
	{
		name: "Pierson",
		abbreviation: "PC",
	},
	{
		name: "Saybrook",
		abbreviation: "SY",
	},
	{
		name: "Silliman",
		abbreviation: "SM",
	},
	{
		name: "Timothy Dwight",
		abbreviation: "TD",
	},
	{
		name: "Trumbull",
		abbreviation: "TC",
	},
] as const;

export const RESIDENTIAL_COLLEGE_ABBREVIATIONS = RESIDENTIAL_COLLEGES.map(
	(college) => college.abbreviation,
);

export const RESIDENTIAL_COLLEGE_NAMES = RESIDENTIAL_COLLEGES.map(
	(college) => college.name,
);
