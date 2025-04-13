<script setup lang="ts"></script>

<template>
	<q-layout view="lHh Lpr lFf">
		<q-header>
			<q-toolbar>
				<q-btn class="text-h6" stretch no-caps flat to="/" icon="emoji_events" label="Course Superlatives" />
				<q-space />
				<q-btn round flat icon="code" href="https://github.com/braden-w/coursetable-labs" target="_blank" />
				<!-- <q-btn round flat icon="info" to="/about" /> -->
				<q-toggle v-model="$q.dark.mode" color="blue-grey-5" @click="$q.dark.toggle()" />
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
			<q-footer class="text-center bg-dark">
				&copy; Table Labs 2023
			</q-footer>
		</q-page-container>
	</q-layout>
</template>
