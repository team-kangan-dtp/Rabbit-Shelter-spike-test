<script lang="ts">
    import DataTable from "./users-data-table.svelte";
    import { columns } from "./columns.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { PageProps } from './$types';
    import { MediaQuery } from "svelte/reactivity";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import * as Alert from "$lib/components/ui/alert/index.js";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    
    let editDialogOpen = $state(false);
    let deleteDialogOpen = $state(false);
    let selectedUser = $state<User | null>(null);
    let isSubmitting = $state(false);
    let isDeleting = $state(false);
    let formMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);
    let deleteMessage = $state<{ type: 'success' | 'error'; text: string } | null>(null);
    const isDesktop = new MediaQuery("(min-width: 768px)");

    let { data, form }: PageProps = $props();

    function handleEditUser(id: string) {
        selectedUser = data.users.find(user => user.id === id) || null;
        editDialogOpen = true;
        formMessage = null; // Clear any previous messages
    }

    function handleDeleteUser(id: string) {
        selectedUser = data.users.find(user => user.id === id) || null;
        deleteDialogOpen = true;
        deleteMessage = null; // Clear any previous messages
    }

    // Add the edit and delete callbacks to each user
    const usersWithActions = $derived(
        data.users.map(user => ({
            ...user,
            onEdit: handleEditUser,
            onDelete: handleDeleteUser
        }))
    );

    function handleFormSubmit() {
        isSubmitting = true;
        return async ({
            result,
            update
        }: {
            result: any;
            update: () => Promise<void>;
        }) => {
            isSubmitting = false;

            if (result.type === 'success') {
                formMessage = { type: 'success', text: 'User updated successfully!' };
                await invalidateAll(); // Refresh the data
                setTimeout(() => {
                    editDialogOpen = false;
                    formMessage = null;
                }, 1500);
            } else if (result.type === 'failure') {
                formMessage = { type: 'error', text: result.data?.error || 'Failed to update user' };
            }

            await update();
        };
    }

    function handleDeleteConfirm() {
        isDeleting = true;
        return async ({
            result,
            update
        }: {
            result: any;
            update: () => Promise<void>;
        }) => {
            isDeleting = false;

            if (result.type === 'success') {
                deleteMessage = { type: 'success', text: 'User deleted successfully!' };
                await invalidateAll(); // Refresh the data
                setTimeout(() => {
                    deleteDialogOpen = false;
                    deleteMessage = null;
                }, 1500);
            } else if (result.type === 'failure') {
                deleteMessage = { type: 'error', text: result.data?.error || 'Failed to delete user' };
            }

            await update();
        };
    }
</script>

<main class="container p-7 mx-auto flex flex-col gap-6">
    <Breadcrumb.Root>
        <Breadcrumb.List>
            <Breadcrumb.Item>
                <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
                <Breadcrumb.Link href="/users">Users</Breadcrumb.Link>
            </Breadcrumb.Item>
        </Breadcrumb.List>
    </Breadcrumb.Root>
    
    <h2 class="text-3xl font-semibold pb-5">Users</h2>
    <DataTable data={usersWithActions} {columns} />
</main>

{#if isDesktop.current}
  <Dialog.Root bind:open={editDialogOpen}>
    <Dialog.Content>
      <form method="POST" action="?/updateUser" use:enhance={handleFormSubmit} class="grid items-start gap-4">
        <Dialog.Header>
          <Dialog.Title>Edit User</Dialog.Title>
          <Dialog.Description>
            Make changes to the user profile here. Click save when you're done.
          </Dialog.Description>
        </Dialog.Header>
        {#if selectedUser}
          <input type="hidden" name="id" value={selectedUser.id} />
          
          {#if formMessage}
            <Alert.Root class={formMessage.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              <Alert.Description class={formMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {formMessage.text}
              </Alert.Description>
            </Alert.Root>
          {/if}
          
          <div class="grid gap-2">
            <Label for="email-{selectedUser.id}">Email</Label>
            <Input 
              type="email" 
              id="email-{selectedUser.id}"
              name="email"
              value={selectedUser.email} 
              required
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="first-name-{selectedUser.id}">First Name</Label>
            <Input 
              id="first-name-{selectedUser.id}"
              name="first_name"
              value={selectedUser.first_name || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="last-name-{selectedUser.id}">Last Name</Label>
            <Input 
              id="last-name-{selectedUser.id}"
              name="last_name"
              value={selectedUser.last_name || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="phone-{selectedUser.id}">Phone</Label>
            <Input 
              id="phone-{selectedUser.id}"
              name="phone"
              value={selectedUser.phone || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="role-{selectedUser.id}">Role</Label>
            <Input 
              id="role-{selectedUser.id}"
              name="role"
              value={selectedUser.role} 
              required
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        {/if}
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={editDialogOpen}>
    <Drawer.Content>
      <form method="POST" action="?/updateUser" use:enhance={handleFormSubmit} class="grid items-start gap-4 px-4">
        <Drawer.Header class="text-left">
          <Drawer.Title>Edit User</Drawer.Title>
          <Drawer.Description>
            Make changes to the user profile here. Click save when you're done.
          </Drawer.Description>
        </Drawer.Header>
        {#if selectedUser}
          <input type="hidden" name="id" value={selectedUser.id} />
          
          {#if formMessage}
            <Alert.Root class={formMessage.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              <Alert.Description class={formMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {formMessage.text}
              </Alert.Description>
            </Alert.Root>
          {/if}
          
          <div class="grid gap-2">
            <Label for="mobile-email-{selectedUser.id}">Email</Label>
            <Input 
              type="email" 
              id="mobile-email-{selectedUser.id}"
              name="email"
              value={selectedUser.email} 
              required
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="mobile-first-name-{selectedUser.id}">First Name</Label>
            <Input 
              id="mobile-first-name-{selectedUser.id}"
              name="first_name"
              value={selectedUser.first_name || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="mobile-last-name-{selectedUser.id}">Last Name</Label>
            <Input 
              id="mobile-last-name-{selectedUser.id}"
              name="last_name"
              value={selectedUser.last_name || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="mobile-phone-{selectedUser.id}">Phone</Label>
            <Input 
              id="mobile-phone-{selectedUser.id}"
              name="phone"
              value={selectedUser.phone || ''} 
              disabled={isSubmitting}
            />
          </div>
          <div class="grid gap-2">
            <Label for="mobile-role-{selectedUser.id}">Role</Label>
            <Input 
              id="mobile-role-{selectedUser.id}"
              name="role"
              value={selectedUser.role} 
              required
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        {/if}
      </form>
      <Drawer.Footer class="pt-2">
        <Drawer.Close class={buttonVariants({ variant: "outline" })} disabled={isSubmitting}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}

{#if isDesktop.current}
  <Dialog.Root bind:open={deleteDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete User</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this user? This action cannot be undone.
        </Dialog.Description>
      </Dialog.Header>
      {#if selectedUser}
        <form method="POST" action="?/deleteUser" use:enhance={handleDeleteConfirm}>
          <input type="hidden" name="id" value={selectedUser.id} />
          
          {#if deleteMessage}
            <Alert.Root class={deleteMessage.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              <Alert.Description class={deleteMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {deleteMessage.text}
              </Alert.Description>
            </Alert.Root>
          {/if}
          
          <p class="text-sm text-muted-foreground mb-4">
            You are about to delete: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ({selectedUser.email})
          </p>
          
          <div class="flex justify-end gap-2">
            <Button 
              type="button"
              variant="outline" 
              onclick={() => deleteDialogOpen = false} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </form>
      {/if}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={deleteDialogOpen}>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>Delete User</Drawer.Title>
        <Drawer.Description>
          Are you sure you want to delete this user? This action cannot be undone.
        </Drawer.Description>
      </Drawer.Header>
      {#if selectedUser}
        <form method="POST" action="?/deleteUser" use:enhance={handleDeleteConfirm} class="px-4">
          <input type="hidden" name="id" value={selectedUser.id} />
          
          {#if deleteMessage}
            <Alert.Root class={deleteMessage.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              <Alert.Description class={deleteMessage.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {deleteMessage.text}
              </Alert.Description>
            </Alert.Root>
          {/if}
          
          <p class="text-sm text-muted-foreground mb-4">
            You are about to delete: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> ({selectedUser.email})
          </p>
          
          <div class="flex justify-end gap-2">
            <Button 
              type="button"
              variant="outline" 
              onclick={() => deleteDialogOpen = false} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </form>
      {/if}
      <Drawer.Footer class="pt-2">
        <Drawer.Close class={buttonVariants({ variant: "outline" })} disabled={isDeleting}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}