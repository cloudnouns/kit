<script>
	import { onMount } from 'svelte';
	import { Noun } from '$lib/index';
	import Example from './_components/Example.svelte';
	import Highlight from 'svelte-highlight';
	import javascript from 'svelte-highlight/languages/javascript';
	import githubDark from 'svelte-highlight/styles/github-dark';

	const code = `// svelte\n<script>\n	import { Noun } from '@cloudnouns/kit';\n	const myNoun = new Noun();\n<\/script>\n\n<img src={myNoun.images.svg} alt='noun' />`;

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

<svelte:head>
	{@html githubDark}
</svelte:head>

<div class="flex flex-col bg-[#dcff70] min-h-screen p-5">
	<!-- <h1>Examples</h1>
	<p>See the documentation</p> -->

	<Example title="Random Noun">
		<div class="my-2">
			<Highlight language={javascript} {code} />
			<!-- <div class="flex justify-end gap-1">
				<button class="btn">react</button>
				<button class="btn">svelte</button>
				<button class="btn">vue</button>
			</div> -->
		</div>
	</Example>

	<!-- <button
		on:click={getRandomNouns}
		class="my-10 bg-rose-400 self-center px-10 py-2">refresh nouns</button
	> -->

	<!-- {#if noun}
		<div
			class="grid grid-cols-2 px-5 pb-5 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center mx-auto"
		>
			<img src={lilnoun.images.svg} alt="" class="box" />
			<img src={noun.images.svg} alt="" class="box" />

			{#each nouns as n}
				<img src={n.images.svg} alt="" class="box" />
			{/each}
		</div>
	{/if} -->
</div>

<style>
	.box {
		@apply border-2 border-black;
	}

	.btn {
		@apply text-sm bg-black text-white px-4 py-0.5;
	}
</style>
