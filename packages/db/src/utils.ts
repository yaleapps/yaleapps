import { type SQL, getTableColumns, sql } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

/**
 * Utility function to build update columns for SQLite upsert operations using the `onConflictDoUpdate` method.
 * This function helps create a dynamic set of columns to update when a conflict occurs during an insert operation.
 *
 * @example
 * ```ts
 * // Example usage with a users table
 * const values = [
 *   { id: 1, name: 'John', email: 'john@example.com', lastLogin: new Date() },
 *   { id: 2, name: 'Jane', email: 'jane@example.com', lastLogin: new Date() }
 * ];
 *
 * await db
 *   .insert(users)
 *   .values(values)
 *   .onConflictDoUpdate({
 *     target: users.id,
 *     set: buildConflictUpdateColumns(users, ['name', 'lastLogin']), // Only update name and lastLogin
 *   });
 * ```
 *
 * @param table - The SQLite table object defined with Drizzle schema
 * @param columns - Array of column names to be updated on conflict
 * @returns An object mapping column names to their corresponding `excluded` table references
 *
 * @see https://orm.drizzle.team/docs/guides/upsert#postgresql-and-sqlite
 */
export const buildConflictUpdateColumns = <
	T extends SQLiteTable,
	Q extends keyof T["_"]["columns"],
>(
	table: T,
	columns: Q[],
) => {
	const cls = getTableColumns(table);
	return columns.reduce(
		(acc, column) => {
			const colName = cls[column].name;
			acc[column] = sql.raw(`excluded.${colName}`);
			return acc;
		},
		{} as Record<Q, SQL>,
	);
};
