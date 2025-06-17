<!-- src/routes/animals/+page.svelte -->
<script lang="ts">
	export let data;
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Plus } from 'lucide-svelte';
	import AnimalsDataTable from '$lib/components/animals/animals-data-table.svelte';

	// State for editing and creating
	let editingAnimal: any = null;
	let showCreateForm = false;

	// Handle edit from data table - now using callback props
	function handleEdit(animal: any) {
		editingAnimal = { ...animal };
		showCreateForm = false;
	}

	// Handle delete from data table - now using callback props
	function handleDelete(animal: any) {
		if (confirm(`Are you sure you want to delete ${animal.name}?`)) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '?/delete';

			const idInput = document.createElement('input');
			idInput.type = 'hidden';
			idInput.name = 'animal_id';
			idInput.value = animal.animal_id;

			form.appendChild(idInput);
			document.body.appendChild(form);
			form.submit();
		}
	}

	function handleCreate() {
		editingAnimal = null;
		showCreateForm = true;
	}

	function handleCancel() {
		editingAnimal = null;
		showCreateForm = false;
	}
</script>

<h1>Animals</h1>

{#if data.error}
	<p class="error">Error: {data.error}</p>
{/if}

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane>
		<!-- Add New Animal Button -->
		<div class="mb-4">
			<Button on:click={handleCreate}>
				<Plus class="h-4 w-4 mr-2" />
				Add New Animal
			</Button>
		</div>

		<!-- Use callback props instead of event listeners -->
		<AnimalsDataTable animals={data.animals} onEdit={handleEdit} onDelete={handleDelete} />
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<Resizable.Pane class="p-2">
		<Card.Root class="w-full h-full p-2">
			<Card.Header>
				<Card.Title>
					{#if showCreateForm}
						Add New Animal
					{:else if editingAnimal}
						Edit Animal
					{:else}
						Animal Details
					{/if}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if showCreateForm}
					<!-- CREATE FORM -->
					<form method="POST" action="?/create" class="space-y-4">
						<div>
							<label for="name" class="block text-sm font-medium mb-1">Name:</label>
							<Input type="text" name="name" required />
						</div>
						<div>
							<label for="species" class="block text-sm font-medium mb-1">Species:</label>
							<Input type="text" name="species" required />
						</div>
						<div>
							<label for="breed" class="block text-sm font-medium mb-1">Breed:</label>
							<Input type="text" name="breed" />
						</div>
						<div class="flex gap-2">
							<Button type="submit">Create Animal</Button>
							<Button type="button" variant="outline" on:click={handleCancel}>Cancel</Button>
						</div>
					</form>
				{:else if editingAnimal}
					<!-- UPDATE FORM -->
					<form method="POST" action="?/update" class="space-y-4">
						<input type="hidden" name="animal_id" value={editingAnimal.animal_id} />
						<div>
							<label for="name" class="block text-sm font-medium mb-1">Name:</label>
							<Input type="text" name="name" value={editingAnimal.name} required />
						</div>
						<div>
							<label for="species" class="block text-sm font-medium mb-1">Species:</label>
							<Input type="text" name="species" value={editingAnimal.species} required />
						</div>
						<div class="flex gap-2">
							<Button type="submit">Update Animal</Button>
							<Button type="button" variant="outline" on:click={handleCancel}>Cancel</Button>
						</div>
					</form>
				{:else}
					<p>Select an animal to view/edit details, or click "Add New Animal" to create one.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</Resizable.Pane>
</Resizable.PaneGroup>

<style>
	.error {
		color: red;
	}
</style>
