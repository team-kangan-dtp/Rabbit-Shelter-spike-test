<script lang="ts">
    import DataTable from "./users-data-table.svelte";
    import { columns } from "./columns.js";
    import * as Card from "$lib/components/ui/card/index.js";

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
    <DataTable {data} {columns} />

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