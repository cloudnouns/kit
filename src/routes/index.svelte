<script>
	import { onMount } from 'svelte';
	import { Noun } from '$lib/index';

	let noun;
	let lilnoun;
	let nouns = [];

	const getRandomNouns = () => {
		noun = new Noun({
			traits: {
				background: 2
			}
		});
		lilnoun = new Noun({ style: 'lil', traits: noun.seed, hex: noun.hex });
		nouns = new Array(10)
			.fill()
			.map((n) => new Noun({ traits: { background: 2 } }));
	};

	onMount(() => {
		getRandomNouns();
	});
</script>

<div class="flex flex-col bg-[#dcff70] min-h-screen">
	<button
		on:click={getRandomNouns}
		class="my-10 bg-rose-400 self-center px-10 py-2">refresh nouns</button
	>

	{#if noun}
		<div
			class="grid grid-cols-2 px-5 pb-5 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center mx-auto"
		>
			<img src={lilnoun.images.svg} alt="" class="box" />
			<img src={noun.images.svg} alt="" class="box" />

			{#each nouns as n}
				<img src={n.images.svg} alt="" class="box" />
			{/each}
		</div>
	{/if}
</div>

<style>
	.box {
		@apply border-2 border-black;
	}
</style>
