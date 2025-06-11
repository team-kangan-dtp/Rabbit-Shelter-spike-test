<script lang="ts">
    import DataTable from '$lib/components/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';

    type DataItem = typeof data[0];

    type User = {
        id: string
        email: string
        first_name?: string
        last_name?: string
        phone?: string
        role: string
        created_at: Date
        updated_at: Date
    }

    // Define the columns for the DataTable
    const columns: ColumnDef<DataItem>[] = [
		{
			accessorKey: 'id',
			header: 'User ID',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'first_name',
			header: 'First Name',
		},
		{
			accessorKey: 'last_name',
			header: 'Last Name',
		},
		{
			accessorKey: 'phone',
			header: 'Phone Number',
		},
		{
			accessorKey: 'role',
			header: 'Role',
		},
		{
			accessorKey: 'created_at',
			header: 'Created',
		},
        {
            accessorKey: 'updated_at',
            header: 'Last Updated',
        }
	];


    // Sample data for the DataTable
    // This should be replaced with actual data fetching logic
    export const data: User[] = [
        {
            id: "728ed52f",
            email: "m@example.com",
            first_name: "John",
            last_name: "Doe",
            phone: "+1234567890",
            role: "admin",
            created_at: new Date("2023-01-01T12:00:00Z"),
            updated_at: new Date("2023-01-02T12:00:00Z")
        },
        {
            id: "a1b2c3d4",
            email: "alice@example.com",
            first_name: "Alice",
            last_name: "Smith",
            phone: "+1987654321",
            role: "user",
            created_at: new Date("2023-02-10T09:30:00Z"),
            updated_at: new Date("2023-02-15T10:00:00Z")
        },
        {
            id: "e5f6g7h8",
            email: "bob@example.com",
            first_name: "Bob",
            last_name: "Johnson",
            phone: "+1123456789",
            role: "moderator",
            created_at: new Date("2023-03-05T14:20:00Z"),
            updated_at: new Date("2023-03-06T16:45:00Z")
        },
        {
            id: "i9j0k1l2",
            email: "carol@example.com",
            first_name: "Carol",
            last_name: "Williams",
            phone: "+1098765432",
            role: "user",
            created_at: new Date("2023-04-12T08:15:00Z"),
            updated_at: new Date("2023-04-13T11:25:00Z")
        },
        {
            id: "m3n4o5p6",
            email: "dave@example.com",
            first_name: "Dave",
            last_name: "Brown",
            phone: "+1230984567",
            role: "admin",
            created_at: new Date("2023-05-20T17:40:00Z"),
            updated_at: new Date("2023-05-21T18:55:00Z")
        }
    ]
</script>

<main class="container p-7 mx-auto flex flex-col gap-6">
    <h2 class="text-3xl font-semibold pb-5">Users</h2>
    <DataTable {data} {columns} className="Users" />
</main>