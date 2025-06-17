<!-- src/routes/animals/+page.svelte -->
<script lang="ts">
	export let data;
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<h1>Animals</h1>

{#if data.error}
	<p class="error">Error: {data.error}</p>
{/if}

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane>
		<ul>
			{#each data.animals as animal}
				<li>
					<strong>{animal.name}</strong> - {animal.species}
					{#if animal.breed}
						({animal.breed})
					{/if}
					- Status: {animal.adoption_status}
				</li>
			{/each}
		</ul>
	</Resizable.Pane>
	<Resizable.Handle withHandle />

	<Resizable.Pane class="p-2">
		<Card.Root class="w-full h-full p-2"></Card.Root>
	</Resizable.Pane>
</Resizable.PaneGroup>

<style>
	.error {
		color: red;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>
