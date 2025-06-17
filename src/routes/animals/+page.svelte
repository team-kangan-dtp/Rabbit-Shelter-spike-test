<!-- src/routes/animals/+page.svelte -->
<script lang="ts">
	export let data;
	export let form; // Add this to receive form action results
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Plus, Pencil, Trash2 } from 'lucide-svelte';

	// Define the Animal type
	type Animal = {
		animal_id: string;
		name: string;
		species: string;
		breed?: string;
		dob?: string;
		arrival_date: string;
		neutered: boolean;
		adoption_status: string;
		bonded_with?: string;
	};

	// State for editing and creating
	let editingAnimal: Animal | null = null;
	let showCreateForm = false;

	// Handle edit from data table
	function handleEdit(animal: Animal) {
		console.log('🔧 Edit clicked for:', animal);
		editingAnimal = { ...animal };
		showCreateForm = false;
	}

	// Handle delete from data table
	function handleDelete(animal: Animal) {
		console.log('🗑️ Delete clicked for:', animal);
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
		console.log('➕ Create new animal clicked');
		editingAnimal = null;
		showCreateForm = true;
	}

	function handleCancel() {
		console.log('❌ Cancel clicked');
		editingAnimal = null;
		showCreateForm = false;
	}

	// Add form submission handler for debugging
	function handleFormSubmit(event: Event) {
		console.log('📝 Form submitted:', event.target);
		// Let the form submit naturally - don't prevent default
	}

	// Debug log for animals data
	console.log('🐾 Animals data received in page:', data.animals);
</script>

<h1>Animals</h1>

{#if data.error}
	<p class="error">Error: {data.error}</p>
{/if}

<!-- Add error display -->
{#if form?.error}
	<p class="error">Error: {form.error}</p>
{/if}

{#if form?.success}
	<p class="success">Animal created successfully!</p>
{/if}

<!-- Debug info -->
<div class="mb-4 p-2 bg-gray-100 rounded text-sm">
	<p>
		Debug: showCreateForm = {showCreateForm}, editingAnimal = {editingAnimal
			? editingAnimal.name
			: 'null'}
	</p>
	<p>Animals count: {data.animals?.length || 0}</p>
</div>

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane class="w-full h-full p-3">
		<!-- Add New Animal Button -->
		<div class="mb-4">
			<Button onclick={handleCreate}>
				<Plus class="h-4 w-4 mr-2" />
				Add New Animal
			</Button>
		</div>

		<!-- Data Table - moved from component -->
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Species</Table.Head>
						<Table.Head>Breed</Table.Head>
						<Table.Head>DOB</Table.Head>
						<Table.Head>Arrival Date</Table.Head>
						<Table.Head>Neutered</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.animals as animal (animal.animal_id)}
						<Table.Row>
							<Table.Cell class="font-medium">{animal.name}</Table.Cell>
							<Table.Cell>{animal.species}</Table.Cell>
							<Table.Cell>{animal.breed || '-'}</Table.Cell>
							<Table.Cell>{animal.dob || '-'}</Table.Cell>
							<Table.Cell>{animal.arrival_date}</Table.Cell>
							<Table.Cell>{animal.neutered ? 'Yes' : 'No'}</Table.Cell>
							<Table.Cell>
								<span class="capitalize">{animal.adoption_status}</span>
							</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex justify-end gap-2">
									<Button variant="outline" size="sm" onclick={() => handleEdit(animal)}>
										<Pencil class="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="sm" onclick={() => handleDelete(animal)}>
										<Trash2 class="h-4 w-4" />
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={8} class="h-24 text-center">No animals found.</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Resizable.Pane>

	<Resizable.Pane class="p-3" style="width: 400px; min-width: 400px; max-width: 400px;">
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
					<p class="mb-4 text-green-600">CREATE FORM IS SHOWING</p>
					<!-- CREATE FORM -->
					<form method="POST" action="?/create" class="space-y-4" onsubmit={handleFormSubmit}>
						<div>
							<label for="name" class="block text-sm font-medium mb-1">Name:</label>
							<Input type="text" name="name" id="name" required />
						</div>
						<div>
							<label for="species" class="block text-sm font-medium mb-1">Species:</label>
							<Input type="text" name="species" id="species" required />
						</div>
						<div>
							<label for="breed" class="block text-sm font-medium mb-1">Breed:</label>
							<Input type="text" name="breed" id="breed" />
						</div>
						<div>
							<label for="arrival_date" class="block text-sm font-medium mb-1">Arrival Date:</label>
							<Input type="date" name="arrival_date" id="arrival_date" required />
						</div>
						<div>
							<label for="adoption_status" class="block text-sm font-medium mb-1">Status:</label>
							<select name="adoption_status" id="adoption_status" class="w-full p-2 border rounded">
								<option value="No">Available</option>
								<option value="Reserved">Reserved</option>
								<option value="Adopted">Adopted</option>
							</select>
						</div>
						<div>
							<label class="flex items-center">
								<input type="checkbox" name="neutered" id="neutered" class="mr-2" />
								Neutered
							</label>
						</div>
						<div class="flex gap-2">
							<Button type="submit">Create Animal</Button>
							<Button type="button" variant="outline" onclick={handleCancel}>Cancel</Button>
						</div>
					</form>
				{:else if editingAnimal}
					<p class="mb-4 text-blue-600">EDIT FORM IS SHOWING</p>
					<!-- UPDATE FORM -->
					<form method="POST" action="?/update" class="space-y-4">
						<input type="hidden" name="animal_id" value={editingAnimal.animal_id} />
						<div>
							<label for="edit_name" class="block text-sm font-medium mb-1">Name:</label>
							<Input type="text" name="name" id="edit_name" value={editingAnimal.name} required />
						</div>
						<div>
							<label for="edit_species" class="block text-sm font-medium mb-1">Species:</label>
							<Input
								type="text"
								name="species"
								id="edit_species"
								value={editingAnimal.species}
								required
							/>
						</div>
						<div>
							<label for="edit_breed" class="block text-sm font-medium mb-1">Breed:</label>
							<Input type="text" name="breed" id="edit_breed" value={editingAnimal.breed || ''} />
						</div>
						<div>
							<label for="edit_arrival_date" class="block text-sm font-medium mb-1"
								>Arrival Date:</label
							>
							<Input
								type="date"
								name="arrival_date"
								id="edit_arrival_date"
								value={editingAnimal.arrival_date}
								required
							/>
						</div>
						<div>
							<label for="edit_adoption_status" class="block text-sm font-medium mb-1"
								>Status:</label
							>
							<select
								name="adoption_status"
								id="edit_adoption_status"
								class="w-full p-2 border rounded"
							>
								<option value="No" selected={editingAnimal.adoption_status === 'No'}
									>Available</option
								>
								<option value="Reserved" selected={editingAnimal.adoption_status === 'Reserved'}
									>Reserved</option
								>
								<option value="Adopted" selected={editingAnimal.adoption_status === 'Adopted'}
									>Adopted</option
								>
							</select>
						</div>
						<div>
							<label class="flex items-center">
								<input
									type="checkbox"
									name="neutered"
									id="edit_neutered"
									class="mr-2"
									checked={editingAnimal.neutered}
								/>
								Neutered
							</label>
						</div>
						<div class="flex gap-2">
							<Button type="submit">Update Animal</Button>
							<Button type="button" variant="outline" onclick={handleCancel}>Cancel</Button>
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
