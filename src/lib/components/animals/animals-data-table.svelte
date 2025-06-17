<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Pencil, Trash2 } from 'lucide-svelte';

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

	// Props
	export let animals: Animal[] = [];
	export let onEdit: (animal: Animal) => void = () => {};
	export let onDelete: (animal: Animal) => void = () => {};

	function handleEdit(animal: Animal) {
		onEdit(animal);
	}

	function handleDelete(animal: Animal) {
		onDelete(animal);
	}
</script>

<!-- Simple Data Table using shadcn components -->
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
			{#each animals as animal (animal.animal_id)}
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
							<Button variant="outline" size="sm" on:click={() => handleEdit(animal)}>
								<Pencil class="h-4 w-4" />
							</Button>
							<Button variant="destructive" size="sm" on:click={() => handleDelete(animal)}>
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
