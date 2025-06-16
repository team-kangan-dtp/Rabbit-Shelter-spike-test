<!-- src/routes/animals/+page.svelte -->
<script>
	export let data;
</script>

<h1>Animals</h1>

{#if data.error}
	<p class="error">Error: {data.error}</p>
{/if}

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

<style>
	.error {
		color: red;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>
