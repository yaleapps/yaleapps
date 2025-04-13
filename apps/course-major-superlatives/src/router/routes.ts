import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/form/2025",
	},
	{
		path: "/form",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", redirect: "/form/2025" },
			{ path: "2023", component: () => import("pages/form/2023.vue") },
			{ path: "2025", component: () => import("pages/form/2025.vue") },
		],
	},
	{
		path: "/success",
		component: () => import("layouts/MainLayout.vue"),
		children: [{ path: "", component: () => import("pages/success.vue") }],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
