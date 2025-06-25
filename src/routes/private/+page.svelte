<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import RabbitIcon from '@lucide/svelte/icons/rabbit';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import PawPrintIcon from '@lucide/svelte/icons/paw-print';
	import UsersIcon from '@lucide/svelte/icons/users';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import type { PageData } from './$types';

	let { data, form } = $props();
	let { user } = $derived(data);

	const navigateTo = (path: string) => {
		goto(path);
	};
</script>

<div class="bg-background min-h-svh p-6 md:p-10">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Header with User Info and Logout -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md"
				>
					<RabbitIcon class="size-6" />
				</div>
				<div>
					<h1 class="text-2xl font-bold">Welcome back!</h1>
					<p class="text-muted-foreground">Signed in as {user?.email}</p>
				</div>
			</div>

			<!-- Server-side logout form -->
			<form method="POST" action="?/logout" use:enhance>
				<Button type="submit" variant="outline" class="gap-2">
					<LogOutIcon class="size-4" />
					Logout
				</Button>
			</form>
		</div>

		<!-- Show any logout errors -->
		{#if form?.error}
			<div class="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
				Logout failed: {form.error}
			</div>
		{/if}

		<!-- Quick Actions Card -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Quick Actions</Card.Title>
				<Card.Description>Navigate to different sections of the application</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Animals Card -->
					<button
						on:click={() => navigateTo('/animals')}
						class="group p-6 bg-background hover:bg-accent border rounded-lg transition-colors text-center space-y-3 cursor-pointer"
					>
						<div class="flex justify-center">
							<PawPrintIcon class="size-8 text-primary group-hover:text-primary/80" />
						</div>
						<div>
							<h3 class="font-semibold">Animals</h3>
							<p class="text-sm text-muted-foreground">Manage shelter animals</p>
						</div>
					</button>

					<!-- Users Card -->
					<button
						on:click={() => navigateTo('/users')}
						class="group p-6 bg-background hover:bg-accent border rounded-lg transition-colors text-center space-y-3 cursor-pointer"
					>
						<div class="flex justify-center">
							<UsersIcon class="size-8 text-primary group-hover:text-primary/80" />
						</div>
						<div>
							<h3 class="font-semibold">Users</h3>
							<p class="text-sm text-muted-foreground">Manage user accounts</p>
						</div>
					</button>

					<!-- Shifts Card -->
					<button
						on:click={() => navigateTo('/shifts')}
						class="group p-6 bg-background hover:bg-accent border rounded-lg transition-colors text-center space-y-3 cursor-pointer"
					>
						<div class="flex justify-center">
							<CalendarIcon class="size-8 text-primary group-hover:text-primary/80" />
						</div>
						<div>
							<h3 class="font-semibold">Shifts</h3>
							<p class="text-sm text-muted-foreground">View and manage shifts</p>
						</div>
					</button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
