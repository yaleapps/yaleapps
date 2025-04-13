import { type SQL, getTableColumns, sql } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

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

/**
 * Creates a table creator function that automatically prefixes all table names.
 * This is a Drizzle ORM pattern for managing multi-project schemas in a single database.
 *
 * Why use table prefixing?
 * 1. Namespace Isolation: Keeps related tables separate from other features
 * 2. Conflict Prevention: Avoids naming collisions in shared database environments
 * 3. Better Organization: Makes it easy to:
 *    - Filter tables in migrations (using tablesFilter: ["prefix_*"])
 *    - Identify related tables during database inspection
 *    - Group related features in database management tools
 *
 * @example
 * ```ts
 * // Create a table creator for the lobby feature
 * const createLobbyTable = createPrefixedTableCreator("lobby");
 *
 * // Use it to create tables
 * const matches = createLobbyTable("matches", {
 *   id: integer("id").primaryKey(),
 *   // ... other columns
 * });
 * // Result: Creates a table named "lobby_matches"
 * ```
 *
 * @param prefix - The prefix to add to all table names (e.g., "lobby", "auth")
 * @returns A function that creates SQLite tables with the specified prefix
 */
export function createPrefixedTableCreator(prefix: string) {
	return sqliteTableCreator((name) => `${prefix}_${name}`);
}
