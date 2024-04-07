// import { insertAveragesOfCommentSentimentsOfCourses } from './insert-averages-of-courses';
import { syncCourseTableToSqlite } from './sync-coursetable-to-sqlite-via-graphql';

async function main() {
	await syncCourseTableToSqlite();
	// await insertAveragesOfCommentSentimentsOfCourses();
}

main();
