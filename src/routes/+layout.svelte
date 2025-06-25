<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { children, data } = $props();
	let { session, supabase } = $derived(data);

	// Check if we're on an auth route - using $derived instead of $:
	let isAuthRoute = $derived($page.url.pathname.startsWith('/auth'));

	// Set up auth state listener
	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});
</script>

{#if isAuthRoute}
	<!-- Clean layout for auth pages - no sidebar -->
	{@render children()}
{:else}
	<!-- Normal layout with sidebar for all other pages -->
	<Sidebar.Provider
		style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
	>
		<AppSidebar variant="inset" />
		<Sidebar.Inset>
			<SiteHeader />
			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
