export interface ImageFiles {
	[key: string]: EncodedImage[] | GenericEncodedImage[];
}

export interface NounSeed {
	[key: string]: number;
	background: number;
	body: number;
	accessory: number;
	head: number;
	glasses: number;
}

export interface GenericNounSeed {
	[key: string]: number | string;
	background?: number | string;
	body?: number | string;
	accessory?: number | string;
	head?: number | string;
	glasses?: number | string;
}

export interface NounData {
	parts: Array<GenericEncodedImage | EncodedImage>;
	palette: string[];
	background: string;
}

export interface EncodedImage {
	id: number;
	filename: string;
	label: string;
	data: string;
}

export interface GenericEncodedImage {
	id: number;
	filename?: string;
	label?: string;
	data: string;
}

export interface DecodedImage {
	paletteIndex: number;
	bounds: ImageBounds;
	rects: [length: number, colorIndex: number][];
}

export interface ImageBounds {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface IOptions {
	traits?: GenericNounSeed | NounSeed | number[];
	text?: string;
	hash?: string;
	hex?: string;
	size?: number;
	style?: Style;
}

export interface GenericObject {
	[trait: string]: string;
}

export interface GenericEncodedObject {
	[trait: string]: EncodedImage | GenericEncodedImage;
}

export type Style = 'classic' | 'lil';

export interface ImageData {
	[style: string]: ImageSet;
}

export interface ImageSet {
	palette: string[];
	traits: ImageFiles;
	custom_traits: ImageFiles;
}
