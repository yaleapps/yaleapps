import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { cn } from '@repo/ui/lib/utils';
import type {
	Column
} from '@tanstack/react-table';
import React from 'react';

export function SortableColumnHeader<TData>({ column }: { column: Column<TData> }) {
	return (
		<Button
			className="-ml-2 px-2"
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			Subject
		</Button>
	);
}


export function RenderText({ children }: { children: React.ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger className="truncate">{children}</PopoverTrigger>
			<PopoverContent className="flex w-fit max-w-md flex-col gap-2">{children}</PopoverContent>
		</Popover>
	);
}

export function RenderBadges({
	items,
	getBadgeColor = () => '',
}: {
	items: string[];
	getBadgeColor?: (item: string) => string;
}) {
	return (
		<Popover>
			<PopoverTrigger className="no-scrollbar flex items-center overflow-x-auto">
				{items.map((item) => {
					const badgeColor = getBadgeColor(item);
					return (
						<Badge
							key={item}
							variant="outline"
							className={cn('mr-1 whitespace-nowrap', badgeColor)}
						>
							{item}
						</Badge>
					);
				})}
			</PopoverTrigger>
			<PopoverContent className="flex w-fit max-w-md flex-col gap-2">
				{items.map((item) => {
					const badgeColor = getBadgeColor(item);
					return (
						<Badge
							key={item}
							variant="outline"
							className={cn('mr-1 whitespace-nowrap', badgeColor)}
						>
							{item}
						</Badge>
					);
				})}
			</PopoverContent>
		</Popover>
	);
}
