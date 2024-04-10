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
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import type { DisplayCourse } from '../_[seasonCode]';

export const columns: ColumnDef<DisplayCourse>[] = [
	{
		id: 'course_code',
		accessorFn: (row) => row.listings.map((listing) => listing.course_code).join(' '),
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
	},
	// {
	// 	id: 'description',
	// 	accessorFn: (row) => row.description,
	// 	header: ({ column }) => {
	// 		return (
	// 			<Button
	// 				variant="ghost"
	// 				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
	// 			>
	// 				Description
	// 			</Button>
	// 		);
	// 	},
	// 	cell: ({ getValue }) => {
	// 		return (
	// 			<div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
	// 				{getValue()}
	// 			</div>
	// 		);
	// 	},
	// },
	{
		id: 'areas/skills',
		accessorFn: (row) => `${row.areas?.join(' ')} ${row.skills?.join(' ')}`.trim(),
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
		accessorFn: (row) => row.average_rating,
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
		id: 'average_workload',
		accessorFn: (row) => row.average_workload,
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
		id: 'average_comment_pos',
		accessorFn: (row) => row.average_comment_pos,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Comment Positive
				</Button>
			);
		},
	},
	{
		id: 'average_comment_neu',
		accessorFn: (row) => row.average_comment_neu,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Comment Neutral
				</Button>
			);
		},
	},
	{
		id: 'average_comment_neg',
		accessorFn: (row) => row.average_comment_neg,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Average Comment Negative
				</Button>
			);
		},
	},
	{
		id: 'average_comment_compound',
		accessorFn: (row) => row.average_comment_compound,
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

export function CoursesDataTable({ courses }: { courses: DisplayCourse[] }) {
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
