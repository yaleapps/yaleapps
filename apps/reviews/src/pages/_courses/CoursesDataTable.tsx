import type { Course } from '@repo/db/courses';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@repo/ui/components/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/ui/components/table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React from 'react';

export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: 'code',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Code
				</Button>
			);
		},
	},
	{
		accessorKey: 'title',
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
	},
	{
		accessorKey: 'professors',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Professors
				</Button>
			);
		},
	},
	{
		accessorKey: 'times_summary',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Meets
				</Button>
			);
		},
	},
	{
		accessorKey: 'locations_summary',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Location
				</Button>
			);
		},
	},
	{
		accessorKey: 'description',
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
	},
	{
		accessorKey: 'credits',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Credits
				</Button>
			);
		},
	},
	{
		accessorKey: 'last_enrollment',
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
		accessorKey: 'skills',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Skills
				</Button>
			);
		},
	},
	{
		accessorKey: 'areas',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Areas
				</Button>
			);
		},
	},
	{
		accessorKey: 'average_rating',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Rating
				</Button>
			);
		},
	},
	{
		accessorKey: 'average_workload',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Workload
				</Button>
			);
		},
	},
	{
		accessorKey: 'average_comment_compound',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Comment Compound
				</Button>
			);
		},
	},
];

export function CoursesDataTable({ courses }: { courses: Course[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

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
		estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
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
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
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
					className="relative overflow-auto"
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
									className="absolute w-full"
									style={{ transform: `translateY(${virtualRow.start}px)` }}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
