<script lang="ts" context="module">
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
</script>

<script lang="ts">
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import * as Table from '$lib/components/ui/table/index.js';
	import { FlexRender, createSvelteTable } from '$lib/components/ui/data-table/index.js';
	import { Pencil, Trash2 } from 'lucide-svelte';

	// Props
	export let animals: Animal[] = [];

	// Callback props instead of event dispatcher
	export let onEdit: (animal: Animal) => void = () => {};
	export let onDelete: (animal: Animal) => void = () => {};

	// Define table columns - simplified without snippets
	const columns: ColumnDef<Animal>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => `<div class="font-medium">${row.getValue('name')}</div>`
		},
		{
			accessorKey: 'species',
			header: 'Species'
		},
		{
			accessorKey: 'breed',
			header: 'Breed',
			cell: ({ row }) => (row.getValue('breed') as string) || '-'
		},
		{
			accessorKey: 'dob',
			header: 'Date of Birth',
			cell: ({ row }) => (row.getValue('dob') as string) || '-'
		},
		{
			accessorKey: 'arrival_date',
			header: 'Arrival Date'
		},
		{
			accessorKey: 'neutered',
			header: 'Neutered',
			cell: ({ row }) => ((row.getValue('neutered') as boolean) ? 'Yes' : 'No')
		},
		{
			accessorKey: 'adoption_status',
			header: 'Status',
			cell: ({ row }) => `<span class="capitalize">${row.getValue('adoption_status')}</span>`
		},
		{
			id: 'actions',
			header: 'Actions',
			enableHiding: false,
			cell: ({ row }) => {
				const animal = row.original;
				// Return HTML string directly instead of using snippets
				return `
                    <div class="flex justify-end gap-2">
                        <button 
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            onclick="window.editAnimal('${animal.animal_id}')"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                <path d="m15 5 4 4"/>
                            </svg>
                        </button>
                        <button 
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 w-8"
                            onclick="window.deleteAnimal('${animal.animal_id}')"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                `;
			}
		}
	];

	// Create the table
	const table = createSvelteTable({
		get data() {
			return animals;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	// Set up global functions for button clicks
	if (typeof window !== 'undefined') {
		(window as any).editAnimal = (animalId: string) => {
			const animal = animals.find((a) => a.animal_id === animalId);
			if (animal) {
				onEdit(animal);
			}
		};

		(window as any).deleteAnimal = (animalId: string) => {
			const animal = animals.find((a) => a.animal_id === animalId);
			if (animal) {
				onDelete(animal);
			}
		};
	}
</script>

<!-- Data Table -->
<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">
						No animals found.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
