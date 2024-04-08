import type { Course } from '@repo/db/courses';
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
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'credits',
		header: 'Credits',
	},
	{
		accessorKey: 'areas',
		header: 'Areas',
	},
	{
		accessorKey: 'average_rating',
		// header: 'Average Rating',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email
					{/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
				</Button>
			);
		},
	},
	{
		accessorKey: 'average_workload',
		header: 'Average Workload',
	},
	{
		accessorKey: 'last_enrollment',
		header: 'Last Enrollment',
	},
	{
		accessorKey: 'last_enrollment_season_code',
		header: 'Last Enrollment Season Code',
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

	return (
		<div className="rounded-md border">
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
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
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
