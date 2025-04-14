import type { RouteRecordRaw } from "vue-router";

export const CURRENT_YEAR = "2025";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: `/form/${CURRENT_YEAR}`,
	},
	{
		path: "/form",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", redirect: `/form/${CURRENT_YEAR}` },
			{ path: "2023", component: () => import("pages/form/2023.vue") },
			{ path: "2025", component: () => import("pages/form/2025.vue") },
		],
	},
	{
		path: "/success",
		component: () => import("layouts/MainLayout.vue"),
		children: [{ path: "", component: () => import("pages/success.vue") }],
	},
	{
		path: "/results",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "2025", component: () => import("pages/results/2025.vue") },
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
