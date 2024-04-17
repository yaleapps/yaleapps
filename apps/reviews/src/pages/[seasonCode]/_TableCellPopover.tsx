import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { cn } from '@repo/ui/lib/utils';

/** Popover used to render cell content that may overflow (title, description, course codes, etc.).*/
export function TableCellPopover({
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
					overflowStyle === 'scroll'
						? 'no-scrollbar flex items-center overflow-x-auto'
						: 'truncate',
				)}
			>
				{children}
			</PopoverTrigger>
			<PopoverContent className="flex w-fit max-w-md flex-col gap-2">{children}</PopoverContent>
		</Popover>
	);
}
