<script lang="ts">
	import data from './data.js';
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import { type ColumnDef } from "@tanstack/table-core";

	type DataItem = typeof data[0];

	const columns: ColumnDef<DataItem>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'header',
			header: 'Header',
		},
		{
			accessorKey: 'type',
			header: 'Type',
		},
		{
			accessorKey: 'status',
			header: 'Status',
		},
		{
			accessorKey: 'target',
			header: 'Target',
		},
		{
			accessorKey: 'limit',
			header: 'Limit',
		},
		{
			accessorKey: 'reviewer',
			header: 'Reviewer',
		}
	];
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards />
			<div class="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>
			<div class="px-4 lg:px-6">
				<DataTable {data} {columns} />
			</div>
		</div>
	</div>
</div>
