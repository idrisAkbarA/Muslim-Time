<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	let { data, children } = $props();
</script>

<div class="flex justify-between">
	<div>logo</div>
	<div>
		{#if data.user}
			<form action="/logout" method="POST">
				<Button type="submit">Logout</Button>
			</form>
			{:else}
			<Button href="/login">Login</Button>
		{/if}
	</div>
</div>
{@render children()}
