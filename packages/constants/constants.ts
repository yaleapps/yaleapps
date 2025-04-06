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

export type ResidentialCollege = (typeof RESIDENTIAL_COLLEGES)[number];

export const RESIDENTIAL_COLLEGE_NAMES = [
	"Benjamin Franklin",
	"Berkeley",
	"Branford",
	"Davenport",
	"Ezra Stiles",
	"Grace Hopper",
	"Jonathan Edwards",
	"Morse",
	"Pauli Murray",
	"Pierson",
	"Saybrook",
	"Silliman",
	"Timothy Dwight",
	"Trumbull",
] as const satisfies readonly ResidentialCollege["name"][];

export const RESIDENTIAL_COLLEGE_ABBREVIATIONS = [
	"BF",
	"BK",
	"BR",
	"DC",
	"ES",
	"GH",
	"JE",
	"MC",
	"MY",
	"PC",
	"SY",
	"SM",
	"TD",
	"TC",
] as const satisfies readonly ResidentialCollege["abbreviation"][];
