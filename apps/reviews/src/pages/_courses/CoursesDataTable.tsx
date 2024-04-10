import { Button } from '@repo/ui/components/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import { Badge } from '@repo/ui/components/badge';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import type { DisplayCourse } from '../_[seasonCode]';
import { cn } from '@repo/ui/lib/utils';

function createColorScale(value: number, min: number, max: number) {
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

	// Define the lightness range for the text color (25% to 40%)
	const textLightnessMin = 25;
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

export const columns: ColumnDef<DisplayCourse>[] = [
	{
		id: 'course_code',
		accessorFn: (row) => row.listings.map((listing) => listing.course_code),
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Course Code
				</Button>
			);
		},
		cell: ({ getValue }) => {
			return (
				<div className="overflow-x-auto">
					{getValue<string[]>().map((courseCode) => (
						<Badge key={courseCode} variant="outline" className="mr-1">
							{courseCode}
						</Badge>
					))}
				</div>
			);
		},
	},
	{
		id: 'title',
		accessorFn: (row) => row.title,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Title
				</Button>
			);
		},
		cell: ({ getValue, column: { getSize } }) => {
			return (
				<div
					className="overflow-hidden overflow-ellipsis whitespace-nowrap"
					style={{ maxWidth: getSize() }}
				>
					{getValue<string>()}
				</div>
			);
		},
	},
	{
		id: 'description',
		accessorFn: (row) => row.description,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Description
				</Button>
			);
		},
		cell: ({ getValue, column: { getSize } }) => {
			return (
				<div
					className="overflow-hidden overflow-ellipsis whitespace-nowrap"
					style={{ maxWidth: getSize() }}
				>
					{getValue<string>()}
				</div>
			);
		},
	},
	{
		id: 'areas/skills',
		accessorFn: (row) => [...(row?.areas ?? []), ...(row?.skills ?? [])],
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Areas/Skills
				</Button>
			);
		},
		cell: ({ getValue }) => {
			function getBadgeColor(areaOrSkill: string) {
				if (areaOrSkill === 'Hu') {
					return 'bg-purple-100 text-purple-700 dark:bg-purple-300 dark:text-purple-900';
				}
				if (areaOrSkill === 'So') {
					return 'bg-blue-100 text-blue-700 dark:bg-blue-300 dark:text-purple-900';
				}
				if (areaOrSkill === 'Sc') {
					return 'bg-green-100 text-green-700 dark:bg-green-300 dark:text-purple-900';
				}
				if (areaOrSkill === 'QR') {
					return 'bg-red-100 text-red-700 dark:bg-red-300 dark:text-purple-900';
				}
				if (areaOrSkill === 'WR') {
					return 'bg-orange-100 text-orange-700 dark:bg-orange-300 dark:text-purple-900';
				}
				if (areaOrSkill.startsWith('L')) {
					return 'bg-gray-100 text-gray-700 dark:bg-gray-300 dark:text-purple-900';
				}
				return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
			}
			return (
				<div className="overflow-x-auto">
					{getValue<string[]>().map((areaOrSkill) => {
						let badgeColor = getBadgeColor(areaOrSkill);
						return (
							<Badge key={areaOrSkill} variant="outline" className={cn('mr-1', badgeColor)}>
								{areaOrSkill}
							</Badge>
						);
					})}
				</div>
			);
		},
	},
	{
		id: 'last_enrollment',
		accessorFn: (row) => row.last_enrollment,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Last Enrollment
				</Button>
			);
		},
	},
	{
		id: 'average_rating',
		accessorFn: (row) => row.average_rating?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Rating
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<number>();
			const colorScale = createColorScale(value, 0, 5);
			return (
				<div
					className="flex w-full items-center justify-center"
					style={{
						backgroundColor: colorScale.backgroundColor,
						color: colorScale.textColor,
					}}
				>
					{value}
				</div>
			);
		},
	},
	{
		id: 'average_workload',
		accessorFn: (row) => row.average_workload?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Workload
				</Button>
			);
		},
	},
	{
		id: 'average_comment_pos',
		accessorFn: (row) => row.average_comment_pos?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Positive
				</Button>
			);
		},
	},
	{
		id: 'average_comment_neu',
		accessorFn: (row) => row.average_comment_neu?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Neutral
				</Button>
			);
		},
	},
	{
		id: 'average_comment_neg',
		accessorFn: (row) => row.average_comment_neg?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Negative
				</Button>
			);
		},
	},
	{
		id: 'average_comment_compound',
		accessorFn: (row) => row.average_comment_compound?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Compound
				</Button>
			);
		},
	},
];

export function CoursesDataTable({ courses }: { courses: DisplayCourse[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: 'average_comment_compound', desc: true },
	]);

	const table = useReactTable({
		data: courses,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	const { rows } = table.getRowModel();
	const tableContainerRef = React.useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => 36, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});

	return (
		<div
			className="rounded-md border"
			ref={tableContainerRef}
			style={{
				position: 'relative',
				overflow: 'auto',
				height: '800px',
			}}
		>
			<Table className="grid">
				<TableHeader className="sticky top-0 z-10 grid">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="flex w-full">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										style={{
											display: 'flex',
											width: header.getSize(),
										}}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody
					className="relative grid"
					style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
				>
					{rowVirtualizer.getVirtualItems().length !== 0 ? (
						rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const row = rows[virtualRow.index];
							return (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									data-index={virtualRow.index}
									ref={(node) => rowVirtualizer.measureElement(node)}
									className="absolute flex w-full"
									style={{ transform: `translateY(${virtualRow.start}px)` }}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{
												display: 'flex',
												width: cell.column.getSize(),
											}}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
