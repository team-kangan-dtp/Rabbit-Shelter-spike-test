<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 
 let { id, onEdit, onDelete }: { 
   id: string; 
   onEdit?: (id: string) => void;
   onDelete?: (id: string) => void;
 } = $props();
</script>
 
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="ghost"
    size="icon"
    class="relative size-8 p-0"
   >
    <span class="sr-only">Open menu</span>
    <EllipsisIcon />
   </Button>
  {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content>
  <DropdownMenu.Group>
   <DropdownMenu.Label>User Actions</DropdownMenu.Label>
   <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
    Copy User ID
   </DropdownMenu.Item>
  </DropdownMenu.Group>
  <DropdownMenu.Separator />
  <DropdownMenu.Item><a href={`/users/${id}`}>View user</a></DropdownMenu.Item>
  <DropdownMenu.Item onclick={() => onEdit?.(id)}>Edit user</DropdownMenu.Item>
  <DropdownMenu.Separator />
  <DropdownMenu.Item 
    onclick={() => onDelete?.(id)}
    class="text-red-600 focus:text-red-600 focus:bg-red-50"
  >
    Delete user
  </DropdownMenu.Item>
 </DropdownMenu.Content>
</DropdownMenu.Root>