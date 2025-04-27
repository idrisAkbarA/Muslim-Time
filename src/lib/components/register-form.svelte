<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Register</Card.Title>
		<Card.Description>Enter your email below to register your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<form action="?/register" method="POST">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">Name</Label>
					<Input id="name" name="name" type="email" placeholder="John" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" required />
				</div>
				<Button type="submit" class="w-full">Register</Button>
			</form>
		</div>
		<div class="mt-4 text-center text-sm">
			Have an account already?
			<a href="/login" class="underline"> Login </a>
		</div>
	</Card.Content>
</Card.Root>
