<!-- src/routes/shifts/+page.svelte -->
<script lang="ts">
    export let data;
    export let form;
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Plus, Pencil, Trash2 } from 'lucide-svelte';

    // Define the Shift type
    type Shift = {
        shift_id: number;
        shift_name: string;
        start_time: string;
        end_time: string;
    };

    // State for editing and creating
    let editingShift: Shift | null = null;
    let showCreateForm = false;

    // Reactive statement to hide panel after successful actions
    $: if (form?.success) {
        editingShift = null;
        showCreateForm = false;
    }

    // Check if panel should be visible
    $: showPanel = showCreateForm || editingShift !== null;

    // Handle edit from data table
    function handleEdit(shift: Shift) {
        editingShift = { ...shift };
        showCreateForm = false;
    }

    // Handle delete from data table
    function handleDelete(shift: Shift) {
        if (confirm(`Are you sure you want to delete ${shift.shift_name}?`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '?/delete';

            const idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'shift_id';
            idInput.value = shift.shift_id.toString();

            form.appendChild(idInput);
            document.body.appendChild(form);
            form.submit();
        }
    }

    function handleCreate() {
        editingShift = null;
        showCreateForm = true;
    }

    function handleCancel() {
        editingShift = null;
        showCreateForm = false;
    }
</script>

<div class="p-3 space-y-1">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Shifts</h1>
    <p class="text-xl text-muted-foreground">Manage volunteer shift schedules</p>
</div>

<div class="flex flex-col md:flex-row h-full">
    <div class="w-full p-3">
        <div class="mb-4">
            <Button onclick={handleCreate}>
                <Plus class="h-4 w-4 mr-2" />
                Add New Shift
            </Button>
        </div>

        <!-- Shifts Data Table -->
        <div class="rounded-md border overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-2 text-left">Shift ID</th>
                        <th class="p-2 text-left">Name</th>
                        <th class="p-2 text-left">Start Time</th>
                        <th class="p-2 text-left">End Time</th>
                        <th class="p-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.shifts as shift (shift.shift_id)}
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-2">{shift.shift_id}</td>
                            <td class="p-2 font-medium">{shift.shift_name}</td>
                            <td class="p-2">{shift.start_time}</td>
                            <td class="p-2">{shift.end_time}</td>
                            <td class="p-2 text-right">
                                <div class="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onclick={() => handleEdit(shift)}>
                                        <Pencil class="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onclick={() => handleDelete(shift)}>
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="p-4 h-24 text-center text-gray-500">No shifts found.</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Edit/Create Panel -->
    {#if showPanel}
        <div class="md:border-l md:pl-4 w-full md:w-96 min-w-[400px] p-4">
            <div class="bg-white rounded-lg border shadow-sm h-full flex flex-col">
                <div class="p-4 border-b">
                    <h2 class="text-2xl font-semibold">
                        {#if showCreateForm}
                            Add New Shift
                        {:else if editingShift}
                            Edit Shift
                        {/if}
                    </h2>
                </div>
                <div class="flex-1 p-4">
                    {#if showCreateForm}
                        <!-- CREATE FORM -->
                        <form method="POST" action="?/create" class="flex flex-col h-full">
                            <div class="flex-1 space-y-4">
                                <div class="space-y-2">
                                    <label for="shift_name" class="block text-sm font-medium">Shift Name</label>
                                    <Input type="text" name="shift_name" id="shift_name" required />
                                </div>
                                <div class="space-y-2">
                                    <label for="start_time" class="block text-sm font-medium">Start Time</label>
                                    <Input type="time" name="start_time" id="start_time" required />
                                </div>
                                <div class="space-y-2">
                                    <label for="end_time" class="block text-sm font-medium">End Time</label>
                                    <Input type="time" name="end_time" id="end_time" required />
                                </div>
                            </div>
                            <div class="flex gap-2 pt-6 border-t mt-6">
                                <Button type="submit" class="flex-1">Create Shift</Button>
                                <Button type="button" variant="outline" onclick={handleCancel} class="flex-1"
                                    >Cancel</Button
                                >
                            </div>
                        </form>
                    {:else if editingShift}
                        <!-- UPDATE FORM -->
                        <form method="POST" action="?/update" class="flex flex-col h-full">
                            <input type="hidden" name="shift_id" value={editingShift.shift_id} />
                            <div class="flex-1 space-y-4">
                                <div class="space-y-2">
                                    <label for="edit_shift_name" class="block text-sm font-medium">Shift Name</label>
                                    <Input
                                        type="text"
                                        name="shift_name"
                                        id="edit_shift_name"
                                        value={editingShift.shift_name}
                                        required
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label for="edit_start_time" class="block text-sm font-medium">Start Time</label>
                                    <Input
                                        type="time"
                                        name="start_time"
                                        id="edit_start_time"
                                        value={editingShift.start_time}
                                        required
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label for="edit_end_time" class="block text-sm font-medium">End Time</label>
                                    <Input
                                        type="time"
                                        name="end_time"
                                        id="edit_end_time"
                                        value={editingShift.end_time}
                                        required
                                    />
                                </div>
                            </div>
                            <div class="flex gap-2 pt-6 border-t mt-6">
                                <Button type="submit" class="flex-1">Update Shift</Button>
                                <Button type="button" variant="outline" onclick={handleCancel} class="flex-1"
                                    >Cancel</Button
                                >
                            </div>
                        </form>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Debug info -->
<div
    class="fixed bottom-4 left-4 p-3 bg-white border rounded-lg shadow text-xs max-w-xs z-50 opacity-80 hover:opacity-100 transition-opacity"
>
    <div class="font-semibold mb-2 text-gray-500">Debug Info</div>
    <div class="space-y-1 text-gray-500">
        <p>showCreateForm: <span class="text-gray-900">{showCreateForm}</span></p>
        <p>
            editingShift: <span class="text-gray-900"
                >{editingShift ? editingShift.shift_name : 'null'}</span
            >
        </p>
        <p>Shifts count: <span class="text-gray-900">{data.shifts?.length || 0}</span></p>
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