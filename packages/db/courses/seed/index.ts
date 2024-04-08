// import { insertAveragesOfCommentSentimentsOfCourses } from './insert-averages-of-courses';
import { insertAveragesOfCommentSentimentsOfSameCourses } from './insert-averages-of-courses';
// import { syncCourseTableToSqlite } from './sync-coursetable-to-sqlite';

async function main() {
	// await syncCourseTableToSqlite();
	await insertAveragesOfCommentSentimentsOfSameCourses();
}

main();
