<script setup lang="ts"></script>

<template>
	<q-layout view="lHh Lpr lFf">
		<q-header>
			<q-toolbar class="tw:mx-auto tw:max-w-4xl">
				<q-avatar color="white" text-color="amber" icon="emoji_events" />
				<q-btn class=" text-h6" stretch no-caps flat to="/" label="Course Superlatives" />
				<q-space />
				<q-btn round flat icon="mdi-github"
					href="https://github.com/yaleapps/yaleapps/tree/main/apps/course-major-superlatives/" target="_blank" />
				<!-- <q-btn round flat icon="info" to="/about" /> -->
				<q-toggle v-model="$q.dark.mode" color="blue-grey-5" @click="$q.dark.toggle()" />
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
			<q-footer class="text-center bg-dark">
				&copy; 2025 Yale Course Superlatives
			</q-footer>
		</q-page-container>
	</q-layout>
</template>
