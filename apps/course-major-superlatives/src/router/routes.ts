import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [{ path: "", component: () => import("pages/form/index.vue") }],
	},
	{
		path: "/favorites",
		component: () => import("layouts/MainLayout.vue"),
		children: [{ path: "", component: () => import("pages/form/index.vue") }],
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
