import { Badge } from '@repo/ui/components/badge';

export function createColorScaleBadge({
	value,
	min,
	max,
}: {
	value: number;
	min: number;
	max: number;
}) {
	const colorScale = createColorScale({ value, min, max });
	return (
		<Badge
			style={{
				backgroundColor: colorScale.backgroundColor,
				color: colorScale.textColor,
			}}
		>
			{value}
		</Badge>
	);
}

function createColorScale({ value, min, max }: { value: number | null; min: number; max: number }) {
	if (!value) {
		return {
			backgroundColor: 'inherit',
			textColor: 'inherit',
		} as const;
	}
	const valueDistanceToMin = value - min;
	const totalRangeDistance = max - min;
	const normalizedValueOutOf1 = valueDistanceToMin / totalRangeDistance;
	const hueMinDegrees = 0;
	const hueMaxDegrees = 120;
	const hueBetweenMinMaxDegrees =
		hueMinDegrees + normalizedValueOutOf1 * (hueMaxDegrees - hueMinDegrees);
	const backgroundLightnessMin = 75;
	const backgroundLightnessMax = 90;
	const backgroundLightness =
		backgroundLightnessMin +
		normalizedValueOutOf1 * (backgroundLightnessMax - backgroundLightnessMin);

	// Define the lightness range for the text color (20% to 40%)
	const textLightnessMin = 20;
	const textLightnessMax = 40;

	// Calculate the text lightness based on the normalized value
	const textLightness =
		textLightnessMin + normalizedValueOutOf1 * (textLightnessMax - textLightnessMin);

	// Generate the background color using the HSL color model
	const backgroundColor = `hsl(${hueBetweenMinMaxDegrees}, 100%, ${backgroundLightness}%)`;

	// Generate the text color using the HSL color model
	const textColor = `hsl(${hueBetweenMinMaxDegrees}, 100%, ${textLightness}%)`;

	return {
		backgroundColor,
		textColor,
	};
}
