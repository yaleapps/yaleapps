import { Cross1Icon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Input } from '@repo/ui/components/input';
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
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table';
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import { RenderBadges, RenderText } from '../_RenderCell';
import { createColorScaleBadge } from '../_createColorScaleBadge';
import type { FtsCourse } from './getCourses';

const STARTING_TABLE_HEIGHT_PX = 1200;

export const columns: ColumnDef<FtsCourse>[] = [
	{
		id: 'subject',
		accessorFn: (row) => row.listings.map((listing) => listing.subject),
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Subject
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const subjects = getValue<string[]>();
			return <RenderBadges items={subjects} />;
		},
		filterFn: 'arrIncludes',
	},
	{
		id: 'course_code',
		accessorFn: (row) => row.listings.map((listing) => listing.course_code),
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Course Code
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const courseCodes = getValue<string[]>();
			return <RenderBadges items={courseCodes} />;
		},
		filterFn: 'arrIncludes',
	},
	{
		id: 'title',
		accessorFn: (row) => row.title,
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Title
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<string>();
			return <RenderText>{value}</RenderText>;
		},
		filterFn: 'includesString',
		size: 200,
	},
	{
		id: 'description',
		accessorFn: (row) => row.description,
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Description
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<string>();
			return <RenderText>{value}</RenderText>;
		},
		filterFn: 'includesString',
		size: 500,
	},
	{
		id: 'areas/skills',
		accessorFn: (row) => [...(row?.areas ?? []), ...(row?.skills ?? [])],
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Areas/Skills
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<string[]>();
			return (
				<RenderBadges
					items={value}
					getBadgeColor={(areaOrSkill) => {
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
					}}
				/>
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
					className="-ml-2 px-2"
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
					className="-ml-2 px-2"
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
			return createColorScaleBadge({ value, min: 1, max: 5 });
		},
	},
	{
		id: 'average_workload',
		accessorFn: (row) => row.average_workload?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
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
			return createColorScaleBadge({ value, min: 5, max: 1 });
		},
	},
	{
		id: 'average_comment_pos',
		accessorFn: (row) => row.average_comment_pos?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Pos
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<number | null>();
			if (!value) return;
			return createColorScaleBadge({ value, min: 0, max: 1 });
		},
	},
	{
		id: 'average_comment_neu',
		accessorFn: (row) => row.average_comment_neu?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Neu
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<number | null>();
			if (!value) return;
			return createColorScaleBadge({ value, min: 0, max: 1 });
		},
	},
	{
		id: 'average_comment_neg',
		accessorFn: (row) => row.average_comment_neg?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Avg Comment Neg
				</Button>
			);
		},
		cell: ({ getValue }) => {
			const value = getValue<number | null>();
			if (!value) return;
			return createColorScaleBadge({ value, min: 1, max: 0 });
		},
	},
	{
		id: 'average_comment_compound',
		accessorFn: (row) => row.average_comment_compound?.toFixed(2) ?? '',
		header: ({ column }) => {
			return (
				<Button
					className="-ml-2 px-2"
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
			return createColorScaleBadge({ value, min: 0, max: 1 });
		},
	},
	{
		id: 'crn',
		header: 'Open in CourseTable',
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
				<Button variant="outline" className="-ml-2 flex gap-1 px-2" asChild>
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

export function FtsCoursesDataTable({ courses }: { courses: FtsCourse[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: 'average_comment_compound', desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
		course_code: false,
		average_rating: false,
		average_workload: false,
		average_comment_pos: false,
		average_comment_neu: false,
		average_comment_neg: false,
	});

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
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	const { rows } = table.getRowModel();
	const tableContainerRef = React.useRef<HTMLDivElement>(null);

	const [tableHeight, setTableHeight] = React.useState(STARTING_TABLE_HEIGHT_PX);

	React.useEffect(() => {
		const calculateTableHeight = () => {
			const availableHeight = window.innerHeight - tableContainerRef.current!.offsetTop - 20;
			setTableHeight(availableHeight);
		};

		calculateTableHeight();
		window.addEventListener('resize', calculateTableHeight);

		return () => {
			window.removeEventListener('resize', calculateTableHeight);
		};
	}, []);

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
						value={(table.getColumn('areas/skills')?.getFilterValue() as string) ?? ''}
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
						onClick={() => table.getColumn('areas/skills')?.setFilterValue('')}
					>
						<Cross1Icon className="h-4 w-4 opacity-50" />
					</button>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div
				className="relative overflow-auto rounded-md border"
				ref={tableContainerRef}
				style={{
					height: tableHeight,
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
		</div>
	);
}
