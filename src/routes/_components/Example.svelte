<script>
	import { Noun } from '$lib/index';

	export let title;
	export let opts;

	$: noun = opts ? new Noun(opts) : new Noun();
	$: lilnoun = new Noun({ style: 'lil', traits: noun.seed, hex: noun.hex });
	$: anchor = title ? title.toLowerCase().replace(/ /g, '-') : null;
</script>

<div class="flex flex-col max-w-3xl mx-auto">
	<p id={anchor}>{title}</p>

	<slot />

	<div class="grid grid-cols-2 gap-5">
		<img src={noun.images.svg} alt="noun" class="box w-full" />
		<img src={lilnoun.images.svg} alt="lil noun" class="box w-full" />
	</div>
</div>

<style>
	.box {
		@apply border-2 border-black;
	}
</style>
