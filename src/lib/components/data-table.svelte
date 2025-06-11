<script lang="ts" generics="TData">
	import { 
		type ColumnDef, 
		getCoreRowModel, 
		getPaginationRowModel, 
		getSortedRowModel,
		getFilteredRowModel,
		type SortingState, 
		type PaginationState,
		type ColumnFiltersState,
		type GlobalFilterTableState
	} from "@tanstack/table-core";
	import {
		createSvelteTable,
		FlexRender,
	} from "$lib/components/ui/data-table/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import ChevronLeftIcon from "@tabler/icons-svelte/icons/chevron-left";
	import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@tabler/icons-svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@tabler/icons-svelte/icons/chevrons-right";
	import ChevronUpIcon from "@tabler/icons-svelte/icons/chevron-up";
	import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
	import ChevronsUpDownIcon from "@tabler/icons-svelte/icons/caret-up-down";

	type DataTableProps<TData> = {
		data: TData[];
		columns: ColumnDef<TData>[];
		enablePagination?: boolean;
		enableSorting?: boolean;
		enableFiltering?: boolean;
		enableGlobalFilter?: boolean;
		initialPageSize?: number;
		getRowId?: (row: TData) => string;
		className?: string;
	};

	let {
		data,
		columns,
		enablePagination = true,
		enableSorting = true,
		enableFiltering = true,
		enableGlobalFilter = true,
		initialPageSize = 10,
		getRowId = (row: TData) => (row as any).id?.toString() || Math.random().toString(),
		className = "",
	}: DataTableProps<TData> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: initialPageSize });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let globalFilter = $state<GlobalFilterTableState>();

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get globalFilter() {
				return globalFilter;
			},
		},
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
		...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
		...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === "function") {
				globalFilter = updater(globalFilter);
			} else {
				globalFilter = updater;
			}
		},
	});
</script>

<div class="w-full {className}">
	{#if enableGlobalFilter}
		<div class="flex items-center py-4">
			<Input
				placeholder="Search {className ? className : 'table'}"
				value={globalFilter ?? ""}
				oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
				class="max-w-sm"
			/>
		</div>
	{/if}

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<div class="flex items-center space-x-2">
										{#if header.column.getCanSort() && enableSorting}
											<Button
												variant="ghost"
												class="h-auto p-0 hover:bg-transparent"
												onclick={header.column.getToggleSortingHandler()}
											>
												<FlexRender
													content={header.column.columnDef.header}
													context={header.getContext()}
												/>
												{#if header.column.getIsSorted() === "asc"}
													<ChevronUpIcon class="ml-2 h-4 w-4" />
												{:else if header.column.getIsSorted() === "desc"}
													<ChevronDownIcon class="ml-2 h-4 w-4" />
												{:else}
													<ChevronsUpDownIcon class="ml-2 h-4 w-4" />
												{/if}
											</Button>
										{:else}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</div>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if table.getRowModel().rows?.length}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender
										content={cell.column.columnDef.cell}
										context={cell.getContext()}
									/>
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							No results.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
	
	{#if enablePagination}
		<div class="flex items-center justify-between space-x-2 py-4">
			<div class="flex items-center space-x-2">
				<Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
				<Select.Root
					type="single"
					bind:value={
						() => `${table.getState().pagination.pageSize}`,
						(v) => table.setPageSize(Number(v))
					}
				>
					<Select.Trigger class="h-8 w-[70px]" id="rows-per-page">
						{table.getState().pagination.pageSize}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
							<Select.Item value={pageSize.toString()}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex items-center space-x-6 lg:space-x-8">
				<div class="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div class="flex items-center space-x-2">
					<Button
						variant="outline"
						class="hidden h-8 w-8 p-0 lg:flex"
						onclick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to first page</span>
						<ChevronsLeftIcon class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="h-8 w-8 p-0"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to previous page</span>
						<ChevronLeftIcon class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="h-8 w-8 p-0"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to next page</span>
						<ChevronRightIcon class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						class="hidden h-8 w-8 p-0 lg:flex"
						onclick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to last page</span>
						<ChevronsRightIcon class="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
