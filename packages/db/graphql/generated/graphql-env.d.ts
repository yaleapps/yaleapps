/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
	query: "query_root";
	mutation: never;
	subscription: "subscription_root";
	types: {
		Boolean_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "Boolean_comparison_exp";
			inputFields: [
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
						};
					};
					defaultValue: null;
				},
			];
		};
		Boolean: unknown;
		Int_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "Int_comparison_exp";
			inputFields: [
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
						};
					};
					defaultValue: null;
				},
			];
		};
		Int: unknown;
		String_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "String_comparison_exp";
			inputFields: [
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_ilike";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "String"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_iregex";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_like";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nilike";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "String"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_niregex";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nlike";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nregex";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nsimilar";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_regex";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_similar";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
			];
		};
		String: unknown;
		buildings: {
			kind: "OBJECT";
			name: "buildings";
			fields: {
				building_name: {
					name: "building_name";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				code: {
					name: "code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				locations: {
					name: "locations";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "locations"; ofType: null };
							};
						};
					};
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				url: {
					name: "url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
			};
		};
		buildings_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "buildings_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "buildings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "buildings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "buildings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "building_name";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "locations";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "url";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		buildings_order_by: {
			kind: "INPUT_OBJECT";
			name: "buildings_order_by";
			inputFields: [
				{
					name: "building_name";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "locations_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		buildings_select_column: {
			kind: "ENUM";
			name: "buildings_select_column";
			type: "building_name" | "code" | "last_updated" | "time_added" | "url";
		};
		buildings_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "buildings_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "buildings_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		buildings_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "buildings_stream_cursor_value_input";
			inputFields: [
				{
					name: "building_name";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags: {
			kind: "OBJECT";
			name: "course_flags";
			fields: {
				course: {
					name: "course";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
					};
				};
				course_id: {
					name: "course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				flag: {
					name: "flag";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "flags"; ofType: null };
					};
				};
				flag_id: {
					name: "flag_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
			};
		};
		course_flags_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_flags_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_avg_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "course_flags_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_flags_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_flags_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "flag";
					type: { kind: "INPUT_OBJECT"; name: "flags_bool_exp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_flags_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_max_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_min_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_order_by";
			inputFields: [
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag";
					type: { kind: "INPUT_OBJECT"; name: "flags_order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_select_column: {
			kind: "ENUM";
			name: "course_flags_select_column";
			type: "course_id" | "flag_id";
		};
		course_flags_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_stddev_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_stddev_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_stddev_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "course_flags_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "course_flags_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "course_flags_stream_cursor_value_input";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_sum_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_var_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_var_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_flags_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_flags_variance_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings: {
			kind: "OBJECT";
			name: "course_meetings";
			fields: {
				course: {
					name: "course";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
					};
				};
				course_id: {
					name: "course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				days_of_week: {
					name: "days_of_week";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				end_time: {
					name: "end_time";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				location: {
					name: "location";
					type: { kind: "OBJECT"; name: "locations"; ofType: null };
				};
				location_id: {
					name: "location_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
				};
				start_time: {
					name: "start_time";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
			};
		};
		course_meetings_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_meetings_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_avg_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_meetings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_meetings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "end_time";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "location";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "location_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "start_time";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_meetings_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_max_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "end_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "start_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_min_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "end_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "start_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_order_by";
			inputFields: [
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "end_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "start_time";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_select_column: {
			kind: "ENUM";
			name: "course_meetings_select_column";
			type:
				| "course_id"
				| "days_of_week"
				| "end_time"
				| "location_id"
				| "start_time";
		};
		course_meetings_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_stddev_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_stddev_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_stddev_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "course_meetings_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_stream_cursor_value_input";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "end_time";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "start_time";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_sum_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_var_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_var_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_meetings_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_meetings_variance_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "days_of_week";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors: {
			kind: "OBJECT";
			name: "course_professors";
			fields: {
				course: {
					name: "course";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
					};
				};
				course_id: {
					name: "course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				professor: {
					name: "professor";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "professors"; ofType: null };
					};
				};
				professor_id: {
					name: "professor_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
			};
		};
		course_professors_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_professors_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_avg_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "course_professors_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_professors_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "course_professors_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "professor";
					type: {
						kind: "INPUT_OBJECT";
						name: "professors_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		course_professors_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_max_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_min_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_order_by";
			inputFields: [
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor";
					type: {
						kind: "INPUT_OBJECT";
						name: "professors_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_select_column: {
			kind: "ENUM";
			name: "course_professors_select_column";
			type: "course_id" | "professor_id";
		};
		course_professors_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_stddev_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_stddev_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_stddev_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "course_professors_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "course_professors_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "course_professors_stream_cursor_value_input";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_sum_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_var_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_var_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		course_professors_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "course_professors_variance_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses: {
			kind: "OBJECT";
			name: "courses";
			fields: {
				areas: {
					name: "areas";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					};
				};
				classnotes: {
					name: "classnotes";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				colsem: {
					name: "colsem";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					};
				};
				course_flags: {
					name: "course_flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "course_flags"; ofType: null };
							};
						};
					};
				};
				course_home_url: {
					name: "course_home_url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				course_id: {
					name: "course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				course_meetings: {
					name: "course_meetings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_meetings";
									ofType: null;
								};
							};
						};
					};
				};
				course_professors: {
					name: "course_professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_professors";
									ofType: null;
								};
							};
						};
					};
				};
				credits: {
					name: "credits";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
				};
				description: {
					name: "description";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				extra_info: {
					name: "extra_info";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				final_exam: {
					name: "final_exam";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				fysem: {
					name: "fysem";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					};
				};
				last_offered_course_id: {
					name: "last_offered_course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				listings: {
					name: "listings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "listings"; ofType: null };
							};
						};
					};
				};
				primary_crn: {
					name: "primary_crn";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
				};
				regnotes: {
					name: "regnotes";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				requirements: {
					name: "requirements";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				rp_attr: {
					name: "rp_attr";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				same_course_and_profs_id: {
					name: "same_course_and_profs_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				same_course_id: {
					name: "same_course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				season: {
					name: "season";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "seasons"; ofType: null };
					};
				};
				season_code: {
					name: "season_code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				section: {
					name: "section";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				skills: {
					name: "skills";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					};
				};
				syllabus_url: {
					name: "syllabus_url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				sysem: {
					name: "sysem";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					};
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				title: {
					name: "title";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
			};
		};
		courses_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		courses_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_avg_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "courses_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "courses_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "courses_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "areas";
					type: {
						kind: "INPUT_OBJECT";
						name: "jsonb_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "classnotes";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "colsem";
					type: {
						kind: "INPUT_OBJECT";
						name: "Boolean_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_flags";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_home_url";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_meetings";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_professors";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "credits";
					type: {
						kind: "INPUT_OBJECT";
						name: "float8_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "description";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "extra_info";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "final_exam";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "fysem";
					type: {
						kind: "INPUT_OBJECT";
						name: "Boolean_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "listings";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "regnotes";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "requirements";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "rp_attr";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season";
					type: {
						kind: "INPUT_OBJECT";
						name: "seasons_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "section";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "skills";
					type: {
						kind: "INPUT_OBJECT";
						name: "jsonb_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "syllabus_url";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sysem";
					type: {
						kind: "INPUT_OBJECT";
						name: "Boolean_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "title";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		courses_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_max_order_by";
			inputFields: [
				{
					name: "classnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_home_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "description";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "extra_info";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "final_exam";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "regnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "requirements";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "rp_attr";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "syllabus_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "title";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_min_order_by";
			inputFields: [
				{
					name: "classnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_home_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "description";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "extra_info";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "final_exam";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "regnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "requirements";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "rp_attr";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "syllabus_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "title";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_order_by";
			inputFields: [
				{
					name: "areas";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "classnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "colsem";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_flags_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_home_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_meetings_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_professors_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "description";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "extra_info";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "final_exam";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "fysem";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listings_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "regnotes";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "requirements";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "rp_attr";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season";
					type: {
						kind: "INPUT_OBJECT";
						name: "seasons_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "skills";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "syllabus_url";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "sysem";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "title";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_select_column: {
			kind: "ENUM";
			name: "courses_select_column";
			type:
				| "areas"
				| "classnotes"
				| "colsem"
				| "course_home_url"
				| "course_id"
				| "credits"
				| "description"
				| "extra_info"
				| "final_exam"
				| "fysem"
				| "last_offered_course_id"
				| "last_updated"
				| "primary_crn"
				| "regnotes"
				| "requirements"
				| "rp_attr"
				| "same_course_and_profs_id"
				| "same_course_id"
				| "season_code"
				| "section"
				| "skills"
				| "syllabus_url"
				| "sysem"
				| "time_added"
				| "title";
		};
		courses_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_stddev_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_stddev_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_stddev_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "courses_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "courses_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "courses_stream_cursor_value_input";
			inputFields: [
				{
					name: "areas";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "classnotes";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "colsem";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_home_url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "description";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "extra_info";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "final_exam";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "fysem";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "regnotes";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "requirements";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "rp_attr";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "skills";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "syllabus_url";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "sysem";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "title";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_sum_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_var_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_var_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		courses_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "courses_variance_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "credits";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_offered_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "primary_crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_and_profs_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "same_course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		cursor_ordering: {
			kind: "ENUM";
			name: "cursor_ordering";
			type: "ASC" | "DESC";
		};
		flags: {
			kind: "OBJECT";
			name: "flags";
			fields: {
				course_flags: {
					name: "course_flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "course_flags"; ofType: null };
							};
						};
					};
				};
				flag_id: {
					name: "flag_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				flag_text: {
					name: "flag_text";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
			};
		};
		flags_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "flags_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "flags_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: { kind: "INPUT_OBJECT"; name: "flags_bool_exp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "flags_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course_flags";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "flag_text";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		flags_order_by: {
			kind: "INPUT_OBJECT";
			name: "flags_order_by";
			inputFields: [
				{
					name: "course_flags_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_flags_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "flag_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_text";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		flags_select_column: {
			kind: "ENUM";
			name: "flags_select_column";
			type: "flag_id" | "flag_text" | "last_updated" | "time_added";
		};
		flags_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "flags_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "flags_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		flags_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "flags_stream_cursor_value_input";
			inputFields: [
				{
					name: "flag_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "flag_text";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
			];
		};
		float8: unknown;
		float8_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "float8_comparison_exp";
			inputFields: [
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "float8"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "float8"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "float8"; ofType: null };
						};
					};
					defaultValue: null;
				},
			];
		};
		jsonb: unknown;
		jsonb_cast_exp: {
			kind: "INPUT_OBJECT";
			name: "jsonb_cast_exp";
			inputFields: [
				{
					name: "String";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		jsonb_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "jsonb_comparison_exp";
			inputFields: [
				{
					name: "_cast";
					type: { kind: "INPUT_OBJECT"; name: "jsonb_cast_exp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_contained_in";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_contains";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_has_key";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_has_keys_all";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "String"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_has_keys_any";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "String"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "jsonb"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "jsonb"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "jsonb"; ofType: null };
						};
					};
					defaultValue: null;
				},
			];
		};
		listings: {
			kind: "OBJECT";
			name: "listings";
			fields: {
				course: {
					name: "course";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
					};
				};
				course_code: {
					name: "course_code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				course_id: {
					name: "course_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				crn: {
					name: "crn";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				listing_id: {
					name: "listing_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				number: {
					name: "number";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				school: {
					name: "school";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				season: {
					name: "season";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "seasons"; ofType: null };
					};
				};
				season_code: {
					name: "season_code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				section: {
					name: "section";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				subject: {
					name: "subject";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
			};
		};
		listings_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		listings_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_avg_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "listings_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "listings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "listings_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "crn";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "number";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "school";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season";
					type: {
						kind: "INPUT_OBJECT";
						name: "seasons_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "section";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "subject";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		listings_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_max_order_by";
			inputFields: [
				{
					name: "course_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "number";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "school";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "subject";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_min_order_by";
			inputFields: [
				{
					name: "course_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "number";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "school";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "subject";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_order_by";
			inputFields: [
				{
					name: "course";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "number";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "school";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season";
					type: {
						kind: "INPUT_OBJECT";
						name: "seasons_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "subject";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_select_column: {
			kind: "ENUM";
			name: "listings_select_column";
			type:
				| "course_code"
				| "course_id"
				| "crn"
				| "last_updated"
				| "listing_id"
				| "number"
				| "school"
				| "season_code"
				| "section"
				| "subject"
				| "time_added";
		};
		listings_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_stddev_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_stddev_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_stddev_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "listings_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "listings_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "listings_stream_cursor_value_input";
			inputFields: [
				{
					name: "course_code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "number";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "school";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "section";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "subject";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_sum_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_var_pop_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_var_samp_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		listings_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "listings_variance_order_by";
			inputFields: [
				{
					name: "course_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "crn";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listing_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations: {
			kind: "OBJECT";
			name: "locations";
			fields: {
				building: {
					name: "building";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "OBJECT"; name: "buildings"; ofType: null };
					};
				};
				building_code: {
					name: "building_code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				course_meetings: {
					name: "course_meetings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_meetings";
									ofType: null;
								};
							};
						};
					};
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				location_id: {
					name: "location_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				room: {
					name: "room";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
			};
		};
		locations_aggregate_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_aggregate_order_by";
			inputFields: [
				{
					name: "avg";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_avg_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "count";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "max";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_max_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "min";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_min_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_stddev_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_stddev_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "stddev_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_stddev_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "sum";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_sum_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_pop";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_var_pop_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "var_samp";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_var_samp_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "variance";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_variance_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		locations_avg_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_avg_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "locations_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "locations_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "locations_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "locations_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "building";
					type: {
						kind: "INPUT_OBJECT";
						name: "buildings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "building_code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "course_meetings";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "location_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "room";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		locations_max_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_max_order_by";
			inputFields: [
				{
					name: "building_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "room";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_min_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_min_order_by";
			inputFields: [
				{
					name: "building_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "room";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_order_by";
			inputFields: [
				{
					name: "building";
					type: {
						kind: "INPUT_OBJECT";
						name: "buildings_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "building_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "course_meetings_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_meetings_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "room";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_select_column: {
			kind: "ENUM";
			name: "locations_select_column";
			type:
				| "building_code"
				| "last_updated"
				| "location_id"
				| "room"
				| "time_added";
		};
		locations_stddev_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_stddev_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_stddev_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_stddev_pop_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_stddev_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_stddev_samp_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "locations_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "locations_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "locations_stream_cursor_value_input";
			inputFields: [
				{
					name: "building_code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "location_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "room";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_sum_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_sum_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_var_pop_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_var_pop_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_var_samp_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_var_samp_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		locations_variance_order_by: {
			kind: "INPUT_OBJECT";
			name: "locations_variance_order_by";
			inputFields: [
				{
					name: "location_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		metadata: {
			kind: "OBJECT";
			name: "metadata";
			fields: {
				id: {
					name: "id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				last_update: {
					name: "last_update";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
			};
		};
		metadata_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "metadata_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "metadata_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "metadata_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "metadata_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_update";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		metadata_order_by: {
			kind: "INPUT_OBJECT";
			name: "metadata_order_by";
			inputFields: [
				{
					name: "id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_update";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		metadata_select_column: {
			kind: "ENUM";
			name: "metadata_select_column";
			type: "id" | "last_update";
		};
		metadata_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "metadata_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "metadata_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		metadata_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "metadata_stream_cursor_value_input";
			inputFields: [
				{
					name: "id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_update";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
			];
		};
		order_by: {
			kind: "ENUM";
			name: "order_by";
			type:
				| "asc"
				| "asc_nulls_first"
				| "asc_nulls_last"
				| "desc"
				| "desc_nulls_first"
				| "desc_nulls_last";
		};
		professors: {
			kind: "OBJECT";
			name: "professors";
			fields: {
				course_professors: {
					name: "course_professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_professors";
									ofType: null;
								};
							};
						};
					};
				};
				courses_taught: {
					name: "courses_taught";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				email: {
					name: "email";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				name: {
					name: "name";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				professor_id: {
					name: "professor_id";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
			};
		};
		professors_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "professors_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "professors_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "professors_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "professors_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "course_professors";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "courses_taught";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "email";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "name";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		professors_order_by: {
			kind: "INPUT_OBJECT";
			name: "professors_order_by";
			inputFields: [
				{
					name: "course_professors_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "course_professors_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "courses_taught";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "email";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "name";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		professors_select_column: {
			kind: "ENUM";
			name: "professors_select_column";
			type:
				| "courses_taught"
				| "email"
				| "last_updated"
				| "name"
				| "professor_id"
				| "time_added";
		};
		professors_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "professors_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "professors_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		professors_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "professors_stream_cursor_value_input";
			inputFields: [
				{
					name: "courses_taught";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "email";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "name";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "professor_id";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
			];
		};
		query_root: {
			kind: "OBJECT";
			name: "query_root";
			fields: {
				buildings: {
					name: "buildings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "buildings"; ofType: null };
							};
						};
					};
				};
				buildings_by_pk: {
					name: "buildings_by_pk";
					type: { kind: "OBJECT"; name: "buildings"; ofType: null };
				};
				course_flags: {
					name: "course_flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "course_flags"; ofType: null };
							};
						};
					};
				};
				course_flags_by_pk: {
					name: "course_flags_by_pk";
					type: { kind: "OBJECT"; name: "course_flags"; ofType: null };
				};
				course_meetings: {
					name: "course_meetings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_meetings";
									ofType: null;
								};
							};
						};
					};
				};
				course_professors: {
					name: "course_professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_professors";
									ofType: null;
								};
							};
						};
					};
				};
				course_professors_by_pk: {
					name: "course_professors_by_pk";
					type: { kind: "OBJECT"; name: "course_professors"; ofType: null };
				};
				courses: {
					name: "courses";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
							};
						};
					};
				};
				courses_by_pk: {
					name: "courses_by_pk";
					type: { kind: "OBJECT"; name: "courses"; ofType: null };
				};
				flags: {
					name: "flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "flags"; ofType: null };
							};
						};
					};
				};
				flags_by_pk: {
					name: "flags_by_pk";
					type: { kind: "OBJECT"; name: "flags"; ofType: null };
				};
				listings: {
					name: "listings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "listings"; ofType: null };
							};
						};
					};
				};
				listings_by_pk: {
					name: "listings_by_pk";
					type: { kind: "OBJECT"; name: "listings"; ofType: null };
				};
				locations: {
					name: "locations";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "locations"; ofType: null };
							};
						};
					};
				};
				locations_by_pk: {
					name: "locations_by_pk";
					type: { kind: "OBJECT"; name: "locations"; ofType: null };
				};
				metadata: {
					name: "metadata";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "metadata"; ofType: null };
							};
						};
					};
				};
				metadata_by_pk: {
					name: "metadata_by_pk";
					type: { kind: "OBJECT"; name: "metadata"; ofType: null };
				};
				professors: {
					name: "professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "professors"; ofType: null };
							};
						};
					};
				};
				professors_by_pk: {
					name: "professors_by_pk";
					type: { kind: "OBJECT"; name: "professors"; ofType: null };
				};
				seasons: {
					name: "seasons";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "seasons"; ofType: null };
							};
						};
					};
				};
				seasons_by_pk: {
					name: "seasons_by_pk";
					type: { kind: "OBJECT"; name: "seasons"; ofType: null };
				};
			};
		};
		seasons: {
			kind: "OBJECT";
			name: "seasons";
			fields: {
				courses: {
					name: "courses";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
							};
						};
					};
				};
				last_updated: {
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				listings: {
					name: "listings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "listings"; ofType: null };
							};
						};
					};
				};
				season_code: {
					name: "season_code";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				term: {
					name: "term";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "String"; ofType: null };
					};
				};
				time_added: {
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
				};
				year: {
					name: "year";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: { kind: "SCALAR"; name: "Int"; ofType: null };
					};
				};
			};
		};
		seasons_bool_exp: {
			kind: "INPUT_OBJECT";
			name: "seasons_bool_exp";
			inputFields: [
				{
					name: "_and";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "seasons_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "_not";
					type: {
						kind: "INPUT_OBJECT";
						name: "seasons_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "_or";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: {
								kind: "INPUT_OBJECT";
								name: "seasons_bool_exp";
								ofType: null;
							};
						};
					};
					defaultValue: null;
				},
				{
					name: "courses";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "listings";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_bool_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "term";
					type: {
						kind: "INPUT_OBJECT";
						name: "String_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "time_added";
					type: {
						kind: "INPUT_OBJECT";
						name: "timestamp_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "year";
					type: {
						kind: "INPUT_OBJECT";
						name: "Int_comparison_exp";
						ofType: null;
					};
					defaultValue: null;
				},
			];
		};
		seasons_order_by: {
			kind: "INPUT_OBJECT";
			name: "seasons_order_by";
			inputFields: [
				{
					name: "courses_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "courses_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "last_updated";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "listings_aggregate";
					type: {
						kind: "INPUT_OBJECT";
						name: "listings_aggregate_order_by";
						ofType: null;
					};
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "term";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
				{
					name: "year";
					type: { kind: "ENUM"; name: "order_by"; ofType: null };
					defaultValue: null;
				},
			];
		};
		seasons_select_column: {
			kind: "ENUM";
			name: "seasons_select_column";
			type: "last_updated" | "season_code" | "term" | "time_added" | "year";
		};
		seasons_stream_cursor_input: {
			kind: "INPUT_OBJECT";
			name: "seasons_stream_cursor_input";
			inputFields: [
				{
					name: "initial_value";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "INPUT_OBJECT";
							name: "seasons_stream_cursor_value_input";
							ofType: null;
						};
					};
					defaultValue: null;
				},
				{
					name: "ordering";
					type: { kind: "ENUM"; name: "cursor_ordering"; ofType: null };
					defaultValue: null;
				},
			];
		};
		seasons_stream_cursor_value_input: {
			kind: "INPUT_OBJECT";
			name: "seasons_stream_cursor_value_input";
			inputFields: [
				{
					name: "last_updated";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "season_code";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "term";
					type: { kind: "SCALAR"; name: "String"; ofType: null };
					defaultValue: null;
				},
				{
					name: "time_added";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "year";
					type: { kind: "SCALAR"; name: "Int"; ofType: null };
					defaultValue: null;
				},
			];
		};
		subscription_root: {
			kind: "OBJECT";
			name: "subscription_root";
			fields: {
				buildings: {
					name: "buildings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "buildings"; ofType: null };
							};
						};
					};
				};
				buildings_by_pk: {
					name: "buildings_by_pk";
					type: { kind: "OBJECT"; name: "buildings"; ofType: null };
				};
				buildings_stream: {
					name: "buildings_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "buildings"; ofType: null };
							};
						};
					};
				};
				course_flags: {
					name: "course_flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "course_flags"; ofType: null };
							};
						};
					};
				};
				course_flags_by_pk: {
					name: "course_flags_by_pk";
					type: { kind: "OBJECT"; name: "course_flags"; ofType: null };
				};
				course_flags_stream: {
					name: "course_flags_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "course_flags"; ofType: null };
							};
						};
					};
				};
				course_meetings: {
					name: "course_meetings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_meetings";
									ofType: null;
								};
							};
						};
					};
				};
				course_meetings_stream: {
					name: "course_meetings_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_meetings";
									ofType: null;
								};
							};
						};
					};
				};
				course_professors: {
					name: "course_professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_professors";
									ofType: null;
								};
							};
						};
					};
				};
				course_professors_by_pk: {
					name: "course_professors_by_pk";
					type: { kind: "OBJECT"; name: "course_professors"; ofType: null };
				};
				course_professors_stream: {
					name: "course_professors_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: {
									kind: "OBJECT";
									name: "course_professors";
									ofType: null;
								};
							};
						};
					};
				};
				courses: {
					name: "courses";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
							};
						};
					};
				};
				courses_by_pk: {
					name: "courses_by_pk";
					type: { kind: "OBJECT"; name: "courses"; ofType: null };
				};
				courses_stream: {
					name: "courses_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "courses"; ofType: null };
							};
						};
					};
				};
				flags: {
					name: "flags";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "flags"; ofType: null };
							};
						};
					};
				};
				flags_by_pk: {
					name: "flags_by_pk";
					type: { kind: "OBJECT"; name: "flags"; ofType: null };
				};
				flags_stream: {
					name: "flags_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "flags"; ofType: null };
							};
						};
					};
				};
				listings: {
					name: "listings";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "listings"; ofType: null };
							};
						};
					};
				};
				listings_by_pk: {
					name: "listings_by_pk";
					type: { kind: "OBJECT"; name: "listings"; ofType: null };
				};
				listings_stream: {
					name: "listings_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "listings"; ofType: null };
							};
						};
					};
				};
				locations: {
					name: "locations";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "locations"; ofType: null };
							};
						};
					};
				};
				locations_by_pk: {
					name: "locations_by_pk";
					type: { kind: "OBJECT"; name: "locations"; ofType: null };
				};
				locations_stream: {
					name: "locations_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "locations"; ofType: null };
							};
						};
					};
				};
				metadata: {
					name: "metadata";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "metadata"; ofType: null };
							};
						};
					};
				};
				metadata_by_pk: {
					name: "metadata_by_pk";
					type: { kind: "OBJECT"; name: "metadata"; ofType: null };
				};
				metadata_stream: {
					name: "metadata_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "metadata"; ofType: null };
							};
						};
					};
				};
				professors: {
					name: "professors";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "professors"; ofType: null };
							};
						};
					};
				};
				professors_by_pk: {
					name: "professors_by_pk";
					type: { kind: "OBJECT"; name: "professors"; ofType: null };
				};
				professors_stream: {
					name: "professors_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "professors"; ofType: null };
							};
						};
					};
				};
				seasons: {
					name: "seasons";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "seasons"; ofType: null };
							};
						};
					};
				};
				seasons_by_pk: {
					name: "seasons_by_pk";
					type: { kind: "OBJECT"; name: "seasons"; ofType: null };
				};
				seasons_stream: {
					name: "seasons_stream";
					type: {
						kind: "NON_NULL";
						name: never;
						ofType: {
							kind: "LIST";
							name: never;
							ofType: {
								kind: "NON_NULL";
								name: never;
								ofType: { kind: "OBJECT"; name: "seasons"; ofType: null };
							};
						};
					};
				};
			};
		};
		timestamp: unknown;
		timestamp_comparison_exp: {
			kind: "INPUT_OBJECT";
			name: "timestamp_comparison_exp";
			inputFields: [
				{
					name: "_eq";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gt";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_gte";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_in";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "timestamp"; ofType: null };
						};
					};
					defaultValue: null;
				},
				{
					name: "_is_null";
					type: { kind: "SCALAR"; name: "Boolean"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lt";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_lte";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_neq";
					type: { kind: "SCALAR"; name: "timestamp"; ofType: null };
					defaultValue: null;
				},
				{
					name: "_nin";
					type: {
						kind: "LIST";
						name: never;
						ofType: {
							kind: "NON_NULL";
							name: never;
							ofType: { kind: "SCALAR"; name: "timestamp"; ofType: null };
						};
					};
					defaultValue: null;
				},
			];
		};
	};
};

import * as gqlTada from "gql.tada";

declare module "gql.tada" {
	interface setupSchema {
		introspection: introspection;
	}
}
