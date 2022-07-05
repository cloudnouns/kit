import type {
	NounSeed,
	GenericEncodedImage,
	EncodedImage,
	NounData,
	GenericEncodedObject,
	Style
} from '../global.d.js';
import { NounError } from './classes/NounError.js';
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
import { BigNumber, type BigNumberish } from '@ethersproject/bignumber';
import { getPluralTraitName } from './helpers.js';
import randomColor from 'randomcolor';

import { Images } from './images.js';
const { backgrounds, bodies, accessories, heads, glasses } =
	Images.classic.traits;

/**
 * Get encoded part and background information using a Noun seed
 * @param {NounSeed} seed The Noun seed
 * @param {string} hex the background color
 * @returns {NounData}
 * @throws {NounError} if given id for a trait can't be found
 */
export const getNounData = (
	seed: NounSeed,
	hex: string | undefined,
	style?: Style
): NounData => {
	const traits: GenericEncodedObject = {};

	let ImageData = Images.classic;
	if (style && style !== 'classic') ImageData = Images[style];

	Object.entries(seed).forEach(([trait, value]) => {
		const pluralTrait = getPluralTraitName(trait);

		if (trait === 'background' && value === 2) {
			traits[trait] = {
				id: 2,
				data: hex || randomColor({ luminosity: 'light' }).replace(/#/g, '')
			};
		} else if (value === 9000) {
			traits[trait] = Images.blanks.traits[pluralTrait][0];
		} else if (value > 9000) {
			const t = ImageData.custom_traits[pluralTrait].find(
				(t: EncodedImage | GenericEncodedImage) => t.id === value
			);
			if (t) {
				traits[trait] = t;
			} else {
				throw new NounError({
					type: 'invalid_trait_id',
					msg: `Invalid id for trait. Received: ${value}. Review docs to see if this trait is compatible with the "${style}" style.`
				});
			}
		} else {
			const t = ImageData.traits[pluralTrait].find(
				(t: EncodedImage | GenericEncodedImage) => t.id === value
			);
			if (t) {
				traits[trait] = t;
			} else {
				throw new NounError({
					type: 'invalid_trait_id',
					msg: `Invalid id for trait. Received: ${value}`
				});
			}
		}
	});

	return {
		parts: [traits.body, traits.accessory, traits.head, traits.glasses],
		palette: ImageData.palette,
		background: traits.background.data
	};
};

/**
 * Generate a random Noun seed
 * @returns {NounSeed}
 */
export const getRandomNounSeed = (): NounSeed => {
	return {
		background: Math.floor(Math.random() * backgrounds.length),
		body: Math.floor(Math.random() * bodies.length),
		accessory: Math.floor(Math.random() * accessories.length),
		head: Math.floor(Math.random() * heads.length),
		glasses: Math.floor(Math.random() * glasses.length)
	};
};

/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param {number} shiftAmount The amount to right shift
 * @param {number} uintSize The uint bit size to cast to
 * @returns {string}
 */
export const shiftRightAndCast = (
	value: BigNumberish,
	shiftAmount: number,
	uintSize: number
): string => {
	const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
	return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};

/**
 * Emulates the NounsSeeder.sol methodology for pseudorandomly selecting a part
 * @param {string }pseudorandomness Hex representation of a number
 * @param {number} partCount The number of parts to pseudorandomly choose from
 * @param {number} shiftAmount The amount to right shift
 * @param {number} uintSize The size of the unsigned integer
 * @returns {number}
 */
export const getPseudorandomPart = (
	pseudorandomness: string,
	partCount: number,
	shiftAmount: number,
	uintSize = 48
) => {
	const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
	return BigNumber.from(hex).mod(partCount).toNumber();
};

/**
 * Emulates the NounsSeeder.sol methodology for generating a Noun seed
 * @param {number} nounId The Noun tokenId used to create pseudorandomness
 * @param {string} blockHash The block hash use to create pseudorandomness
 * @returns {NounSeed}
 */
export const getNounSeedFromBlockHash = (nounId: number, blockHash: string) => {
	const pseudorandomness = solidityKeccak256(
		['bytes32', 'uint256'],
		[blockHash, nounId]
	);
	return {
		background: getPseudorandomPart(pseudorandomness, backgrounds.length, 0),
		body: getPseudorandomPart(pseudorandomness, bodies.length, 48),
		accessory: getPseudorandomPart(pseudorandomness, accessories.length, 96),
		head: getPseudorandomPart(pseudorandomness, heads.length, 144),
		glasses: getPseudorandomPart(pseudorandomness, glasses.length, 192)
	};
};

/**
 * Decode the RLE image data into a format that's easier to consume in `buildSVG`.
 * @param {string} image The RLE image data
 * @returns {DecodedImage}
 */
const decodeImage = (image: string) => {
	const data = image.replace(/^0x/, '');
	const paletteIndex = parseInt(data.substring(0, 2), 16);
	const bounds = {
		top: parseInt(data.substring(2, 4), 16),
		right: parseInt(data.substring(4, 6), 16),
		bottom: parseInt(data.substring(6, 8), 16),
		left: parseInt(data.substring(8, 10), 16)
	};
	const rects = data.substring(10);
	return {
		paletteIndex,
		bounds,
		rects:
			rects
				?.match(/.{1,4}/g)
				?.map((rect) => [
					parseInt(rect.substring(0, 2), 16),
					parseInt(rect.substring(2, 4), 16)
				]) ?? []
	};
};

/**
 * Given RLE parts, palette colors, and a background color, build an SVG image.
 * @param {EncodedImage} parts The RLE part datas
 * @param {string[]} paletteColors The hex palette colors
 * @param {string} bgColor The hex background color
 * @param {number} size the desired height and width of the svg
 * @returns {string}
 */
export const buildSVG = (
	parts: Array<EncodedImage | GenericEncodedImage>,
	paletteColors: string[],
	bgColor: string,
	size: number
) => {
	const svgWithoutEndTag = parts.reduce((result, part) => {
		const svgRects: string[] = [];
		const { bounds, rects } = decodeImage(part.data);
		let currentX = bounds.left;
		let currentY = bounds.top;
		rects.forEach((rect) => {
			const [length, colorIndex] = rect;
			const hexColor = paletteColors[colorIndex];
			// Do not push rect if transparent
			if (colorIndex !== 0) {
				svgRects.push(
					`<rect width="${length * 10}" height="10" x="${currentX * 10}" y="${
						currentY * 10
					}" fill="#${hexColor}" shape-rendering="crispEdges" />`
				);
			}
			currentX += length;
			if (currentX === bounds.right) {
				currentX = bounds.left;
				currentY++;
			}
		});
		result += svgRects.join('');
		return result;
	}, `<svg width="${size}" height="${size}" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"> ${bgColor !== 'none' ? `<rect width="100%" height="100%" fill="#${bgColor}" />` : ''}`);

	return `${svgWithoutEndTag}</svg>`;
};
