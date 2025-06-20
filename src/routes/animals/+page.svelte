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

	// Reactive statement to hide panel after successful actions
	$: if (form?.success) {
		editingAnimal = null;
		showCreateForm = false;
	}

	// Check if panel should be visible
	$: showPanel = showCreateForm || editingAnimal !== null;

	// Handle edit from data table
	function handleEdit(animal: Animal) {
		editingAnimal = { ...animal };
		showCreateForm = false;
	}

	// Handle delete from data table
	function handleDelete(animal: Animal) {
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

	// Add form submission handler for debugging
	function handleFormSubmit(event: Event) {
		// Let the form submit naturally - don't prevent default
	}
</script>

<!-- Styled Animals heading with better spacing -->
<div class="p-3 space-y-1">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Animals</h1>
	<p class="text-xl text-muted-foreground">Manage your animal shelter records</p>
</div>

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane class="w-full h-full p-3">
		<!-- Add New Animal Button with better spacing -->
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

	<!-- Only show the panel when an action is active -->
	{#if showPanel}
		<Resizable.Handle class="bg-transparent border-none" withHandle={false} />
		<Resizable.Pane class="p-4" style="width: 400px; min-width: 400px; max-width: 400px;">
			<Card.Root class="w-full h-full flex flex-col">
				<Card.Header class="pb-0">
					<Card.Title class="text-2xl font-semibold">
						{#if showCreateForm}
							Add New Animal
						{:else if editingAnimal}
							Edit Animal
						{/if}
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex-1 flex flex-col pt-0">
					{#if showCreateForm}
						<!-- CREATE FORM -->
						<form
							method="POST"
							action="?/create"
							class="flex flex-col h-full"
							onsubmit={handleFormSubmit}
						>
							<div class="flex-1 space-y-4">
								<div class="space-y-2">
									<label for="name" class="text-sm font-medium leading-none">Name</label>
									<Input type="text" name="name" id="name" required />
								</div>
								<div class="space-y-2">
									<label for="species" class="text-sm font-medium leading-none">Species</label>
									<Input type="text" name="species" id="species" required />
								</div>
								<div class="space-y-2">
									<label for="breed" class="text-sm font-medium leading-none">Breed</label>
									<Input type="text" name="breed" id="breed" />
								</div>
								<div class="space-y-2">
									<label for="arrival_date" class="text-sm font-medium leading-none"
										>Arrival Date</label
									>
									<Input type="date" name="arrival_date" id="arrival_date" required />
								</div>
								<div class="space-y-2">
									<label for="adoption_status" class="text-sm font-medium leading-none"
										>Status</label
									>
									<select
										name="adoption_status"
										id="adoption_status"
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									>
										<option value="No">Available</option>
										<option value="Reserved">Reserved</option>
										<option value="Adopted">Adopted</option>
									</select>
								</div>
								<div class="flex items-center space-x-2">
									<input
										type="checkbox"
										name="neutered"
										id="neutered"
										class="h-4 w-4 rounded border border-input"
									/>
									<label for="neutered" class="text-sm font-medium leading-none">Neutered</label>
								</div>
							</div>
							<div class="flex gap-2 pt-6 border-t mt-6">
								<Button type="submit" class="flex-1">Create Animal</Button>
								<Button type="button" variant="outline" onclick={handleCancel} class="flex-1"
									>Cancel</Button
								>
							</div>
						</form>
					{:else if editingAnimal}
						<!-- UPDATE FORM -->
						<form method="POST" action="?/update" class="flex flex-col h-full">
							<input type="hidden" name="animal_id" value={editingAnimal.animal_id} />
							<div class="flex-1 space-y-4">
								<div class="space-y-2">
									<label for="edit_name" class="text-sm font-medium leading-none">Name</label>
									<Input
										type="text"
										name="name"
										id="edit_name"
										value={editingAnimal.name}
										required
									/>
								</div>
								<div class="space-y-2">
									<label for="edit_species" class="text-sm font-medium leading-none">Species</label>
									<Input
										type="text"
										name="species"
										id="edit_species"
										value={editingAnimal.species}
										required
									/>
								</div>
								<div class="space-y-2">
									<label for="edit_breed" class="text-sm font-medium leading-none">Breed</label>
									<Input
										type="text"
										name="breed"
										id="edit_breed"
										value={editingAnimal.breed || ''}
									/>
								</div>
								<div class="space-y-2">
									<label for="edit_arrival_date" class="text-sm font-medium leading-none"
										>Arrival Date</label
									>
									<Input
										type="date"
										name="arrival_date"
										id="edit_arrival_date"
										value={editingAnimal.arrival_date}
										required
									/>
								</div>
								<div class="space-y-2">
									<label for="edit_adoption_status" class="text-sm font-medium leading-none"
										>Status</label
									>
									<select
										name="adoption_status"
										id="edit_adoption_status"
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
								<div class="flex items-center space-x-2">
									<input
										type="checkbox"
										name="neutered"
										id="edit_neutered"
										class="h-4 w-4 rounded border border-input"
										checked={editingAnimal.neutered}
									/>
									<label for="edit_neutered" class="text-sm font-medium leading-none"
										>Neutered</label
									>
								</div>
							</div>
							<div class="flex gap-2 pt-6 border-t mt-6">
								<Button type="submit" class="flex-1">Update Animal</Button>
								<Button type="button" variant="outline" onclick={handleCancel} class="flex-1"
									>Cancel</Button
								>
							</div>
						</form>
					{/if}
				</Card.Content>
			</Card.Root>
		</Resizable.Pane>
	{/if}
</Resizable.PaneGroup>

<!-- Debug info - positioned in bottom left corner -->
<div
	class="fixed bottom-4 left-80 p-3 bg-background border rounded-lg shadow-lg text-xs max-w-xs z-50 opacity-80 hover:opacity-100 transition-opacity"
>
	<div class="font-semibold mb-2 text-muted-foreground">Debug Info</div>
	<div class="space-y-1 text-muted-foreground">
		<p>showCreateForm: <span class="text-foreground">{showCreateForm}</span></p>
		<p>
			editingAnimal: <span class="text-foreground"
				>{editingAnimal ? editingAnimal.name : 'null'}</span
			>
		</p>
		<p>Animals count: <span class="text-foreground">{data.animals?.length || 0}</span></p>
		<p>Panel visible: <span class="text-foreground">{showPanel}</span></p>
		<p>Form success: <span class="text-foreground">{form?.success || 'false'}</span></p>
	</div>
</div>

<style>
	.error {
		color: red;
	}

	.success {
		color: green;
	}
</style>
