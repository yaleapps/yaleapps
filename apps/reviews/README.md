# Course Sentiments 🎓

<img src="https://github.com/yaleapps/yaleapps/blob/main/apps/reviews/public/favicon.jpg?raw=true" width="256" height="256">

## Introduction

Course Sentiments is a tool designed to expose the sentiment metrics of comments made on courses as cataloged by CourseTable. In summary, these are numbers that represent the overall sentiment of comments made on a course, positive or negative, on a scale of 0 to 1.

Although these fields exist within the CourseTable database, they have not been actively utilized in the application. The primary aim of this project is to aggregate these sentiments and present them in an accessible manner, aiding students in the course selection process by providing an additional layer of insight into course feedback.

## Inspiration

The inspiration for this project stemmed from discovering that CourseTable's database contained several unutilized fields related to comment sentiments. These metrics include `comment_pos`, `comment_neu`, `comment_neg`, and `comment_compound`. Recognizing the potential to leverage this data to assist students in making more informed decisions, Course Sentiments was developed as a means to quickly deploy this functionality, especially in time for course registration periods.

## Technical Stack

- **Web Framework**: [Astro](https://astro.build/), used for building the static site, very easy server side data fetching, and its magical islands architecture.
- **Components**: [React](https://react.dev/), which powers the dynamic components and interactions on the site, specifically the Table.
- **UI**: [shadcn/ui](https://ui.shadcn.com/), which provides a clean and modern interface design, along with [Tailwind CSS](https://tailwindcss.com/).
- **ORM for Database Management**: [Drizzle](https://github.com/drizzle-team/drizzle-orm), an ORM used to define the SQLite schema based on models derived from the CourseTable's `models.py`, which can be found [on their GitHub here](https://github.com/coursetable/ferry/blob/master/ferry/database/models.py). These queries are run in `seed.ts` to populate the local database.
- **Database**: [SQLite](https://orm.drizzle.team/docs/get-started-sqlite), hosting the local copy of the database for development and testing.
- **Table Solution**: [TanStack Table](https://tanstack.com/table/v8), a headless utility that supports building highly interactive and efficient tables.
- **Virtualized Rendering**: Utilizing [TanStack Virtual](https://tanstack.com/virtual/latest), the course data in the table is presented efficiently and doesn't render all at once, ensuring quick load times and smooth interactions, even with large datasets.
- **GraphQL Client**: [gql.tada](https://github.com/0no-co/gql.tada) for magical typesafe GraphQL queries, in combination with [urql](https://formidable.com/open-source/urql/) for fetching data by executing the GraphQL queries written with gql.tada.

## Development Process

### Schema Creation

1. **Schema Parsing**: Using an LLM to parse `models.py` from the CourseTable repository, I generated initial schema definitions. These were refined to create a custom schema appropriate for Drizzle.
2. **Initialize Database with Extra Fields**: I created a local SQLite database using the schema definitions and added additional fields to store the sentiment metrics: `average_comment_neg`, `average_comment_neu`, `average_comment_pos`, and `average_comment_compound`.
3. **GraphQL Integration**: By employing the CourseTable GraphQL API with a session cookie as an authentication method, I could perform queries to fetch data directly from CourseTable's database.
4. **Database Seeding**: I initialized a local SQLite database managed by Drizzle, and then ran `seed.ts` to populate the database with course data from CourseTable using the GraphQL API.

I crafted a comprehensive SQL query using Common Table Expressions (CTEs) to calculate the average sentiment values for each course, which can be found in `seed.ts`. These values, such as `average_comment_neg`, `average_comment_neu`, `average_comment_pos`, and `average_comment_compound`, were then inserted in the `courses` table.

```sql
WITH unique_same_course_ids AS (
	SELECT
		DISTINCT same_course_id
	FROM
		courses
),
average_comments AS (
	SELECT
		courses.same_course_id,
		AVG(evaluation_narratives.comment_neg) AS average_comment_neg,
		COUNT(evaluation_narratives.comment_neg) AS average_comment_neg_n,
		AVG(evaluation_narratives.comment_neu) AS average_comment_neu,
		COUNT(evaluation_narratives.comment_neu) AS average_comment_neu_n,
		AVG(evaluation_narratives.comment_pos) AS average_comment_pos,
		COUNT(evaluation_narratives.comment_pos) AS average_comment_pos_n,
		AVG(evaluation_narratives.comment_compound) AS average_comment_compound,
		COUNT(evaluation_narratives.comment_compound) AS average_comment_compound_n
	FROM
		evaluation_narratives
		INNER JOIN courses ON evaluation_narratives.course_id = courses.course_id
	WHERE
		courses.same_course_id IN (
			SELECT
				same_course_id
			FROM
				unique_same_course_ids
		)
	GROUP BY
		courses.same_course_id
)
UPDATE
	courses
SET
	average_comment_neg = (
		SELECT
			average_comment_neg
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_neg_n = (
		SELECT
			average_comment_neg_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_neu = (
		SELECT
			average_comment_neu
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_neu_n = (
		SELECT
			average_comment_neu_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_pos = (
		SELECT
			average_comment_pos
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_pos_n = (
		SELECT
			average_comment_pos_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_compound = (
		SELECT
			average_comment_compound
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	),
	average_comment_compound_n = (
		SELECT
			average_comment_compound_n
		FROM
			average_comments
		WHERE
			average_comments.same_course_id = courses.same_course_id
	)
WHERE
	courses.same_course_id IN (
		SELECT
			same_course_id
		FROM
			unique_same_course_ids
	);
```

### Static Site Generation

Since querying the SQLite file would be expensive at scale (especially when reading 100+ rows at a time), I instead opt to use SSG, which means each route is pre-rendered at build time rather than generated on the server. This especially works well because the data is static, doesn't change often, and when two different users visit the same site, they will see the same data (these are ideal conditions for SSG).

## Future Goals

While Course Sentiments currently operates as a standalone project, there is a plan to integrate these features back into the main CourseTable application. This integration will allow all students to benefit from enhanced course evaluations directly within the primary course selection tool.

You can consider this project a proof of concept, and the next steps would be to integrate this functionality into the main CourseTable application.

Hope you enjoy!!
