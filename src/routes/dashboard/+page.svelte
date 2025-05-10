<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	let { data }: { data: PageData } = $props();

	async function getBasicSchedule() {
		var response = await fetch('api/schedule/basic');
		console.log('data', data);
		if (!response.ok) {
			console.error('Failed to fetch ICS file');
			return;
		}

		const blob = await response.blob();
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'prayer-schedule.ics'; // filename user sees
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(url); // free memory
	}
</script>

Hi {data.user.email}
<br />

<Button onclick={() => getBasicSchedule()}>Create Basic Schedule</Button>
