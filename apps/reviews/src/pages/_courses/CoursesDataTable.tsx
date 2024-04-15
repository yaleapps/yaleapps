import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@repo/ui/components/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import { cn } from '@repo/ui/lib/utils';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import type { DisplayCourse } from '../_[seasonCode]';
import { Cross1Icon, OpenInNewWindowIcon } from '@radix-ui/react-icons';

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

/** Popover used to render cell content that may overflow (title, description, course codes, etc.).*/
function TableCellPopover({
	overflowStyle,
	children,
}: {
	/** 'ellipses' to truncate text in preview with ellipses, 'scroll' to allow scrolling. Use 'ellipses' to render text in a single line, 'scroll' to badges or other elements that should be displayed in a row.*/
	overflowStyle: 'ellipses' | 'scroll';
	children: React.ReactNode;
}) {
	return (
		<Popover>
			<PopoverTrigger
				className={cn(
					overflowStyle === 'scroll' ? 'no-scrollbar flex overflow-x-auto' : 'truncate',
				)}
			>
				{children}
			</PopoverTrigger>
			<PopoverContent className="flex w-fit max-w-md flex-col gap-2">{children}</PopoverContent>
		</Popover>
	);
}

export const columns: ColumnDef<DisplayCourse>[] = [
	{
		id: 'subject',
		accessorFn: (row) => row.listings.map((listing) => listing.subject),
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Subject
				</Button>
			);
		},
		// TODO: getSize implement
		cell: ({ getValue, column: { getSize } }) => {
			const subjects = getValue<string[]>();
			return (
				<TableCellPopover overflowStyle="scroll">
					{subjects.map((courseCode) => (
						<Badge key={courseCode} variant="outline" className="mr-1 whitespace-nowrap">
							{courseCode}
						</Badge>
					))}
				</TableCellPopover>
			);
		},
		filterFn: 'arrIncludes',
	},
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
		cell: ({ getValue, column: { getSize } }) => {
			const courseCodes = getValue<string[]>();
			return (
				<TableCellPopover overflowStyle="scroll">
					{courseCodes.map((courseCode) => (
						<Badge key={courseCode} variant="outline" className="mr-1 whitespace-nowrap">
							{courseCode}
						</Badge>
					))}
				</TableCellPopover>
			);
		},
		filterFn: 'arrIncludes',
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
			const value = getValue<string>();
			return <TableCellPopover overflowStyle="ellipses">{value}</TableCellPopover>;
		},
		// cell: ({ getValue, column: { getSize } }) => {
		// 	return (
		// 		<div
		// 			className="overflow-hidden overflow-ellipsis whitespace-nowrap"
		// 			style={{ maxWidth: getSize() }}
		// 		>
		// 			{getValue<string>()}
		// 		</div>
		// 	);
		// },
		filterFn: 'includesString',
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
			const value = getValue<string>();
			return <TableCellPopover overflowStyle="ellipses">{value}</TableCellPopover>;
		},
		filterFn: 'includesString',
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
		filterFn: 'arrIncludes',
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
		accessorFn: (row) => row.average_rating?.toFixed(2) ?? null,
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
			const value = getValue<number | null>();
			if (!value) return;
			const colorScale = createColorScale({ value, min: 1, max: 5 });
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
		cell: ({ getValue }) => {
			const value = getValue<number | null>();
			if (!value) return;
			const colorScale = createColorScale({ value, min: 5, max: 1 });
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
		},
	},
	// {
	// 	id: 'average_comment_pos',
	// 	accessorFn: (row) => row.average_comment_pos?.toFixed(2) ?? '',
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				variant="ghost"
	// 				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
	// 			>
	// 				Avg Comment Pos
	// 			</Button>
	// 		);
	// 	},
	// 	cell: ({ getValue }) => {
	// 		const value = getValue<number | null>();
	// 		if (!value) return;
	// 		const colorScale = createColorScale({ value, min: 0, max: 1 });
	// 		return (
	// 			<Badge
	// 				style={{
	// 					backgroundColor: colorScale.backgroundColor,
	// 					color: colorScale.textColor,
	// 				}}
	// 			>
	// 				{value}
	// 			</Badge>
	// 		);
	// 	},
	// },
	// {
	// 	id: 'average_comment_neu',
	// 	accessorFn: (row) => row.average_comment_neu?.toFixed(2) ?? '',
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				variant="ghost"
	// 				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
	// 			>
	// 				Avg Comment Neu
	// 			</Button>
	// 		);
	// 	},
	// 	cell: ({ getValue }) => {
	// 		const value = getValue<number | null>();
	// 		if (!value) return;
	// 		const colorScale = createColorScale({ value, min: 0, max: 1 });
	// 		return (
	// 			<Badge
	// 				style={{
	// 					backgroundColor: colorScale.backgroundColor,
	// 					color: colorScale.textColor,
	// 				}}
	// 			>
	// 				{value}
	// 			</Badge>
	// 		);
	// 	},
	// },
	// {
	// 	id: 'average_comment_neg',
	// 	accessorFn: (row) => row.average_comment_neg?.toFixed(2) ?? '',
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				variant="ghost"
	// 				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
	// 			>
	// 				Avg Comment Neg
	// 			</Button>
	// 		);
	// 	},
	// 	cell: ({ getValue }) => {
	// 		const value = getValue<number | null>();
	// 		if (!value) return;
	// 		const colorScale = createColorScale({ value, min: 1, max: 0 });
	// 		return (
	// 			<Badge
	// 				style={{
	// 					backgroundColor: colorScale.backgroundColor,
	// 					color: colorScale.textColor,
	// 				}}
	// 			>
	// 				{value}
	// 			</Badge>
	// 		);
	// 	},
	// },
	{
		id: 'average_comment_compound',
		accessorFn: (row) => row.average_comment_compound?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Comp
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<number | null>();
			if (!value) return;
			const colorScale = createColorScale({ value, min: 0, max: 1 });
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
		},
	},
	{
		id: 'crn',
		header: '',
		accessorFn: (row) => ({
			season_code: row.season_code,
			crn: row.listings[0].crn,
		}),
		cell: ({ getValue }) => {
			const { season_code, crn } = getValue<{
				season_code: string;
				crn: string;
			}>();
			return (
				<Button variant="outline" className="flex gap-1" asChild>
					<a
						href={`https://coursetable.com/catalog?course-modal=${season_code}-${crn}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						Open <OpenInNewWindowIcon />
					</a>
				</Button>
			);
		},
	},
];

export function CoursesDataTable({ courses }: { courses: DisplayCourse[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: 'average_comment_compound', desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	const uniqueSubjects = Array.from(
		new Set(courses.flatMap((course) => course.listings.map((listing) => listing.subject))),
	).sort();

	const uniqueSkillsAndAreas = Array.from(
		new Set(courses.flatMap((course) => [...(course.skills ?? []), ...(course.areas ?? [])])),
	).sort();

	const table = useReactTable({
		data: courses,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
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
		<div className="flex h-full w-full flex-col gap-2">
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Select
						value={(table.getColumn('subject')?.getFilterValue() as string) ?? ''}
						onValueChange={(value) => table.getColumn('subject')?.setFilterValue(value)}
						defaultValue=""
					>
						<SelectTrigger>
							<SelectValue placeholder="Filter by subject" />
						</SelectTrigger>
						<SelectContent>
							{uniqueSubjects.map((subject) => (
								<SelectItem key={subject} value={subject}>
									{subject}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						className="hover:bg-secondary/80 absolute right-8 top-1/2 -translate-y-1/2 transform"
						onClick={() => table.getColumn('subject')?.setFilterValue('')}
					>
						<Cross1Icon className="h-4 w-4 opacity-50" />
					</button>
				</div>

				<Input
					className="flex-1"
					type="text"
					placeholder="Search by title"
					value={table.getColumn('title')?.getFilterValue() as string}
					onChange={(e) => {
						table.getColumn('title')?.setFilterValue(e.target.value);
					}}
				/>
				<Input
					className="flex-1"
					type="text"
					placeholder="Search by description"
					value={table.getColumn('description')?.getFilterValue() as string}
					onChange={(e) => {
						table.getColumn('description')?.setFilterValue(e.target.value);
					}}
				/>
				<div className="relative flex-1">
					<Select
						onValueChange={(value) => table.getColumn('areas/skills')?.setFilterValue(value)}
						defaultValue=""
					>
						<SelectTrigger>
							<SelectValue placeholder="Filter by area/skill" />
						</SelectTrigger>
						<SelectContent>
							{uniqueSkillsAndAreas.map((item) => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						className="hover:bg-secondary/80 absolute right-8 top-1/2 -translate-y-1/2 transform"
						onClick={() => table.getColumn('subject')?.setFilterValue('')}
					>
						<Cross1Icon className="h-4 w-4 opacity-50" />
					</button>
				</div>
			</div>
			<div className="relative h-[1200px] overflow-auto rounded-md border" ref={tableContainerRef}>
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
		</div>
	);
}
