import type { NounSeed, IOptions, Style } from '../../global.d.js';
import { getNounData, buildSVG } from '../utils.js';
import {
	getSeedFromString,
	parseSeedFromTraits,
	validateHexColor,
	reconcileMultipleInputs,
	validateStyle
} from '../helpers.js';
import { NounError } from './NounError.js';

export class Noun {
	hex?: string;
	images = { svg: '' };
	seed: NounSeed;
	size = 320;
	style: Style = 'classic';
	url: string;

	constructor(options?: IOptions) {
		const { traits, text, hash, hex, size, style } = options || {};

		if (style && validateStyle(style)) {
			this.style = style;
		}

		if (text && traits && !Array.isArray(traits)) {
			this.seed = reconcileMultipleInputs(traits, text, hash);
		} else if (text) {
			this.seed = getSeedFromString(text, hash);
		} else {
			this.seed = parseSeedFromTraits(traits);
		}

		if (size && isNaN(size)) {
			throw new NounError({
				type: 'invalid_size',
				msg: `Received invalid size: ${size}`
			});
		} else if (size) {
			this.size = size;
		}

		if (hex) {
			const strippedHex = hex.replace(/#/g, '');
			validateHexColor(strippedHex);
			this.hex = strippedHex;
		}

		this.images.svg =
			'data:image/svg+xml;base64,' + btoa(this.buildSVGString());
		this.url = this.buildUrl();
	}

	private buildUrl() {
		const baseUrl = 'https://api.cloudnouns.com/v1/pfp?seed=';
		let url = baseUrl + Object.values(this.seed).join(',');
		if (this.seed.background === 2) url += '&hex=' + this.hex;
		if (this.size !== 320) url += '&size=' + this.size;
		if (this.style !== 'classic') url += '&style=' + this.style;

		return url;
	}

	private buildSVGString() {
		const { parts, palette, background } = getNounData(
			this.seed,
			this.hex,
			this.style
		);
		if (this.seed.background === 2) this.hex = background;
		return buildSVG(parts, palette, background, this.size);
	}
}
