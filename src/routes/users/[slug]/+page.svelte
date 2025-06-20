<script lang="ts">
    import type { PageProps } from './$types';
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { data }: PageProps = $props();
    let isLoading = $state(false);
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
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
                <Breadcrumb.Link href={`/users/${data.user[0].id}`}>{data.user[0].first_name} {data.user[0].last_name}</Breadcrumb.Link>
            </Breadcrumb.Item>
        </Breadcrumb.List>
    </Breadcrumb.Root>
    
    
    <Card.Root>
        <Card.Header>
            <Card.Title class="text-3xl">{data.user[0].first_name} {data.user[0].last_name}</Card.Title>
            <Card.Description>
                Last updated: {new Date(data.user[0].updated_at).toLocaleString()}
                <br>
                Created: {new Date(data.user[0].created_at).toLocaleString()}
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="grid gap-4">
                <div>
                    <p class="font-semibold">Email:</p>
                    <p>{data.user[0].email}</p>
                </div>
                {#if data.user[0].phone}
                    <div>
                        <p class="font-semibold">Phone:</p>
                        <p>{data.user[0].phone}</p>
                    </div>
                {/if}
                <div>
                    <p class="font-semibold">Role:</p>
                    <p>{data.user[0].role}</p>
                </div>
            </div>
        </Card.Content>
        <Card.Footer>
            <Button href="/users">Back to all users</Button>
        </Card.Footer>
    </Card.Root>

    {#if isLoading}
        <p class="text-blue-500">Loading...</p>
    {/if}
</main>
