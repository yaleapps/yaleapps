import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

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
