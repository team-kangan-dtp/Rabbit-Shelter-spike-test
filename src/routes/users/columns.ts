import type { ColumnDef } from "@tanstack/table-core";
import { format } from "date-fns";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import UsersDataTableActions from "./users-data-table-actions.svelte";

// Extend the User type to include the onEdit and onDelete callbacks
type UserWithActions = User & {
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserWithActions>[] = [
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
        cell: ({ getValue }) => {
            const value = getValue() as string | Date | undefined;
            if (!value) return null;
            const date = typeof value === "string" ? new Date(value) : value;
            return format(date, "dd-MM-yyyy HH:mm");
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ getValue }) => {
            const value = getValue() as string | Date | undefined;
            if (!value) return null;
            const date = typeof value === "string" ? new Date(value) : value;
            return format(date, "dd-MM-yyyy HH:mm");
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return renderComponent(UsersDataTableActions, {
                id: user.id,
                onEdit: user.onEdit,
                onDelete: user.onDelete
            });
        }
    }   
];