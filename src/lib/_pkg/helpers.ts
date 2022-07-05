import type {
	NounSeed,
	GenericNounSeed,
	GenericObject,
	EncodedImage,
	GenericEncodedImage,
	Style
} from '../global.d.js';
import { NounError } from './classes/NounError.js';
import { Images } from './images.js';
import { getNounSeedFromBlockHash, getRandomNounSeed } from './utils.js';
import Hashes from 'jshashes';
import hexColorRegex from 'hex-color-regex';

/**
 * Generates a consistent but semi-random number for a given string.
 * @param {string} str Text used to calculate id
 * @returns {number}
 */
export const getIdFromString = (str: string): number => {
	str = str.trim();

	let characters = '';
	let characterCodeSum = 0;

	const hashes = [
		str,
		new Hashes.MD5().hex(str),
		new Hashes.SHA1().b64(str),
		new Hashes.SHA256().hex(str),
		new Hashes.SHA512().b64(str),
		new Hashes.RMD160().b64(str)
	];

	hashes.forEach((h) => (characters += h));
	const characterArray = Array.from(characters);
	characterArray.forEach((c) => (characterCodeSum += c.charCodeAt(0)));
	characterCodeSum *= str.length;
	return characterCodeSum;
};

/**
 * Returns the pluralized version of a given trait
 * @param {string} trait label for trait
 * @returns {string}
 * @throws {NounError} if trait is not valid
 */
export const getPluralTraitName = (trait: string): string => {
	const traits = ['background', 'body', 'accessory', 'head', 'glasses'];

	if (!traits.includes(trait)) {
		throw new NounError({
			type: 'invalid_trait',
			msg: `Invalid key for trait. Received: ${trait}`
		});
	}

	const plurals: GenericObject = {
		background: 'backgrounds',
		body: 'bodies',
		accessory: 'accessories',
		head: 'heads',
		glasses: 'glasses'
	};

	return plurals[trait];
};

/**
 * Generates a NounSeed from a given string and bytes32 hash
 * @param {string} str Text used to calculate id
 * @param {string} hash any valid bytes32 hash (e.g. '0x' + SHA256 hash)
 * @returns {NounSeed}
 */
export const getSeedFromString = (
	str: string,
	hash: string | undefined
): NounSeed => {
	const defaultHash =
		'0xcc60b76e3f2389009a480d62ceddae8091b46b86bb8d0370206a49e9edf9cd16';

	if (!hash) {
		hash = defaultHash;
	} else {
		validateHash(hash);
	}

	const id = getIdFromString(str);
	return getNounSeedFromBlockHash(id, hash);
};

/**
 * Converts an array of 5 numbers into a NounSeed
 * @param {number[]} arr Array of 5 numbers in the order of NounSeed object
 * @returns {NounSeed}
 * @throws {NounError} if array doesn't contain 5 elements
 */
export const parseSeedFromArray = (arr: number[]): NounSeed => {
	if (arr.length !== 5) {
		throw new NounError({
			type: 'invalid_seed_array',
			msg: `Invalid seed array. Expected comma-separated array with 5 values. Received: ${arr}`
		});
	}

	const seed = {
		background: arr[0],
		body: arr[1],
		accessory: arr[2],
		head: arr[3],
		glasses: arr[4]
	};

	validateSeed(seed);
	return seed;
};

/**
 * Generates a NounSeed from given traits. Unsupplied traits are randomly generated
 * @param {NounSeed|number[]} traits Array[5] or full/partial NounSeed.
 * @returns {NounSeed}
 */
export const parseSeedFromTraits = (
	traits: GenericNounSeed | NounSeed | number[] | undefined
): NounSeed => {
	const seed: NounSeed = getRandomNounSeed();

	if (!traits) {
		return seed;
	} else if (Array.isArray(traits)) {
		return parseSeedFromArray(traits);
	} else {
		Object.entries(traits).forEach(([trait, value]) => {
			if (value === 0) {
				seed[trait] = 0;
			} else if (typeof value === 'string') {
				if (['n', 'none'].includes(value)) {
					seed[trait] = 9000;
				} else {
					throw new NounError({
						type: 'invalid_trait',
						msg: `Invalid value for ${trait}. Received: ${value}`
					});
				}
			} else if (value) {
				seed[trait] = value;
			}
		});

		validateSeed(seed);
		return seed;
	}
};

/**
 * Generates a seed from inputs and overrides with user inputs
 * @param {GenericNounSeed} traits
 * @param {string} text
 * @param {string} [hash]
 * @returns {NounSeed}
 */
export const reconcileMultipleInputs = (
	traits: GenericNounSeed,
	text: string,
	hash?: string
): NounSeed => {
	const initialSeed: GenericNounSeed = getSeedFromString(text, hash);

	Object.entries(traits).forEach(([trait, value]) => {
		initialSeed[trait] = value;
	});

	return parseSeedFromTraits(initialSeed);
};

/**
 * Generates an array with the id of each valid option for a given trait
 * @param {string} trait Trait to retrieve ids for
 * @returns {Array<number|string>}
 */
export const traitIds = (trait: string): Array<number | string> => {
	const pluralTrait = getPluralTraitName(trait);

	const classicTraitIds = Images.classic.traits[pluralTrait].map(
		(t: EncodedImage | GenericEncodedImage) => t.id
	);
	const customTraitIds = Images.classic.custom_traits[pluralTrait].map(
		(t: EncodedImage | GenericEncodedImage) => t.id
	);

	return [9000, 'n', 'none', classicTraitIds, customTraitIds].flat();
};

/**
 * Validates if the given hash can be used for Noun generation
 * @param {string} hash bytes32 hash (e.g. '0x' + SHA256 hash)
 * @returns {boolean}
 * @throws {NounError} if hash is not properly formatted
 */
export const validateHash = (hash: string): boolean => {
	if (!hash.startsWith('0x')) {
		throw new NounError({
			type: 'invalid_hash',
			msg: `Invalid value for hash. Expected bytes32. Received: ${hash}`
		});
	}

	const sha = hash.slice(2);
	const checker = /^[a-f0-9]{64}$/gi;
	const isValid = checker.test(sha);

	if (!isValid) {
		throw new NounError({
			type: 'invalid_hash',
			msg: `Invalid value for hash. Expected bytes32. Received: ${hash}`
		});
	}

	return true;
};

/**
 * Validates if the given hex can be used for Noun generation
 * @param {string} hex valid hex color string
 * @returns {boolean}
 * @throws {NounError} if color value can't be validated
 */
export const validateHexColor = (hex: string): boolean => {
	const isValid = hexColorRegex({ strict: true }).test('#' + hex);

	if (!isValid) {
		throw new NounError({
			type: 'invalid_hex',
			msg: `Please provide a valid hex color. Received: ${hex}`
		});
	}

	return true;
};

/**
 * Validates if a given seed can be used for Noun generation
 * @param {NounSeed} seed NounSeed
 * @returns {boolean}
 * @throws {NounError} if given id for a trait can't be found
 */
export const validateSeed = (seed: NounSeed): boolean => {
	Object.entries(seed).forEach(([trait, value]) => {
		if (!traitIds(trait).includes(value))
			throw new NounError({
				type: 'invalid_trait',
				msg: `Invalid value for ${trait}. Received: ${value}`
			});
	});

	return true;
};

/**
 * Validates if a given seed can be used for Noun generation
 * @param {NounSeed} seed NounSeed
 * @returns {boolean}
 * @throws {NounError} if given id for a trait can't be found
 */
export const validateStyle = (style: Style): boolean => {
	const styles = ['classic', 'lil'];
	if (!styles.includes(style)) {
		throw new NounError({
			type: 'invalid_style',
			msg: `Invalid value for style. Received: ${style}`
		});
	}

	return true;
};
