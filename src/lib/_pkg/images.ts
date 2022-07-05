import type { ImageData } from '../global.d.js';

// blanks
import Blanks from './images/blanks.js';

// classic
import ClassicData from './images/classic.js';
import CustomClassicData from './images/custom-classic.js';

// lil nouns
import LilClassicData from './images/lilclassic.js';
import CustomLilClassicData from './images/custom-lilclassic.js';

export const Images: ImageData = {
	blanks: {
		palette: Blanks.palette,
		traits: Blanks.images,
		custom_traits: Blanks.images
	},
	classic: {
		palette: ClassicData.palette,
		traits: ClassicData.images,
		custom_traits: CustomClassicData.images
	},
	lil: {
		palette: LilClassicData.palette,
		traits: LilClassicData.images,
		custom_traits: CustomLilClassicData.images
	}
};
