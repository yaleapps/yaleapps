import { type } from "arktype";

export function isValidYaleEmail(email: string) {
	const Email = type("string.email");
	const result = Email(email);
	return !(result instanceof type.errors);
}
