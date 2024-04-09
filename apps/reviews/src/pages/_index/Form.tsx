import { Button } from '@repo/ui/components/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
	zodResolver,
} from '@repo/ui/components/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@repo/ui/components/select';
import { addedCommentSentimentColumnNames } from '@repo/db/courses';
import { z } from 'zod';

type Year = `${number}${number}${number}${number}`;
type Season = '01' | '02' | '03';
type SeasonCode = `${Year}${Season}`;

const FormSchema = z.object({
	season: z
		.string({
			required_error: 'Please select a season.',
		})
		.refine((value): value is SeasonCode => {
			const regex = /^\d{4}(01|02|03)$/;
			return regex.test(value);
		}),
	sortByColumn: z.enum(addedCommentSentimentColumnNames, {
		required_error: 'Please select a column to sort by.',
	}),
	sortDirection: z.enum(['asc', 'desc'], {
		required_error: 'Please select a sort direction.',
	}),
});

export function SelectForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	return (
		<Form {...form}>
			<form className="w-2/3 space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value} name="field">
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a verified email to display" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="m@example.com">m@example.com</SelectItem>
									<SelectItem value="m@google.com">m@google.com</SelectItem>
									<SelectItem value="m@support.com">m@support.com</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>You can manage email addresses in your </FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
