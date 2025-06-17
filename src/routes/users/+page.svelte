<script lang="ts">
    import DataTable from "./users-data-table.svelte";
    import { columns } from "./columns.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="container p-7 mx-auto flex flex-col gap-6">
    <h2 class="text-3xl font-semibold pb-5">Users</h2>
    <DataTable data={data.users} {columns} />

    <!-- Add user card -->
    <!-- <Card.Root>
        <Card.Header>
            <Card.Title>Add user</Card.Title>
            <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>
            <p>Card Content</p>
        </Card.Content>
        <Card.Footer>
            <p>Card Footer</p>
        </Card.Footer>
    </Card.Root> -->
</main>