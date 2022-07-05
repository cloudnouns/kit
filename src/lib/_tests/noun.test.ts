import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Noun, Images } from '../index.js';
import isBase64 from 'is-base64';
import { faker } from '@faker-js/faker';

const keys = ['background', 'body', 'accessory', 'head', 'glasses'];

describe('Noun Generation', () => {
	// beforeEach(() => {});

	describe('Check Noun properties', () => {
		it('should have the same number of traits for each set', () => {
			const classic = Images.classic;
			const lil = Images.lil;

			expect(classic.traits.backgrounds.length).to.eq(
				lil.traits.backgrounds.length
			);
			expect(classic.traits.bodies.length).to.eq(lil.traits.bodies.length);
			expect(classic.traits.accessories.length).to.eq(
				lil.traits.accessories.length
			);
			expect(classic.traits.heads.length).to.eq(lil.traits.heads.length);
			expect(classic.traits.glasses.length).to.eq(lil.traits.glasses.length);
		});

		it('should have the correct # of seed props', () => {
			const noun = new Noun();
			const hexBgNoun = new Noun({ traits: { background: 2 }, hex: '#719bde' });
			const k = Object.keys(noun);
			const k2 = Object.keys(hexBgNoun);

			expect(k.length).to.eq(5);
			expect(k2.length).to.eq(6);
		});

		it('should have the correct seed props', () => {
			const noun = new Noun();
			const props = ['images', 'seed', 'size', 'style', 'url'];

			expect(noun).to.have.all.keys(props);

			const noun2 = new Noun({ traits: { background: 2 }, hex: '#719bde' });
			const props2 = ['images', 'hex', 'seed', 'size', 'style', 'url'];

			expect(noun2).to.have.all.keys(props2);
		});

		it('should have a correctly ordered seed', () => {
			const noun = new Noun();
			const k = keys.join(',');
			const nounKeys = Object.keys(noun.seed).join(',');

			expect(nounKeys).to.eq(k);
		});

		it('should default size to 320', () => {
			const noun = new Noun();
			const s = 320;

			expect(noun.size).to.eq(s);
		});

		it('should create different sized Nouns', () => {
			const s1 = 100;
			const s2 = 1000;

			const smallNoun = new Noun({ size: s1 });
			const largeNoun = new Noun({ size: s2 });

			expect(smallNoun.size).to.eq(s1);
			expect(largeNoun.size).to.eq(s2);
		});

		it('should return a base64 svg', () => {
			const noun = new Noun();
			const decodedSVG = atob(noun.images.svg.split(',')[1]);

			const result = isBase64(noun.images.svg, {
				allowEmpty: false,
				allowMime: true
			});
			const result2 =
				decodedSVG.startsWith('<svg') && decodedSVG.endsWith('</svg>');

			expect(result).to.be.true;
			expect(result2).to.be.true;
		});

		it('should have a valid url', () => {
			const noun1 = new Noun();
			const noun2 = new Noun({ style: 'lil' });
			const noun3 = new Noun({ style: 'classic' });

			const params1 = new URLSearchParams(noun1.url.split('?')[1]);
			const params2 = new URLSearchParams(noun2.url.split('?')[1]);
			const params3 = new URLSearchParams(noun3.url.split('?')[1]);

			const test1 = params1.get('seed') === Object.values(noun1.seed).join(',');
			const test2 = params2.get('seed') === Object.values(noun2.seed).join(',');
			const test3 = params3.get('seed') === Object.values(noun3.seed).join(',');

			expect(test1).to.be.true;
			expect(test2).to.be.true;
			expect(test3).to.be.true;

			expect(params1.get('style')).to.be.null;
			expect(params2.get('style')).to.eq('lil');
			expect(params3.get('style')).to.be.null;
		});
	});

	describe('Custom Noun generation', () => {
		it('should create a partially custom Noun', () => {
			const noun = new Noun({ traits: { head: 233, glasses: 7 } });

			expect(noun.seed.head).to.eq(233);
			expect(noun.seed.glasses).to.eq(7);
			expect(noun.seed.background).to.not.be.undefined;
			expect(noun.seed.accessory).to.not.be.undefined;
			expect(noun.seed.body).to.not.be.undefined;
		});

		it('should create a fully custom Noun (with object)', () => {
			const traits = {
				background: 0,
				body: 15,
				accessory: 42,
				head: 233,
				glasses: 7
			};
			const noun = new Noun({ traits });

			expect(noun.seed.background).to.eq(0);
			expect(noun.seed.body).to.eq(15);
			expect(noun.seed.accessory).to.eq(42);
			expect(noun.seed.head).to.eq(233);
			expect(noun.seed.glasses).to.eq(7);
		});

		it('should create a fully custom Noun (with number[])', () => {
			const traits = [0, 13, 58, 184, 4];
			const noun = new Noun({ traits });

			expect(noun.seed.background).to.eq(0);
			expect(noun.seed.body).to.eq(13);
			expect(noun.seed.accessory).to.eq(58);
			expect(noun.seed.head).to.eq(184);
			expect(noun.seed.glasses).to.eq(4);
		});

		it('should create a Noun with a hex bg', () => {
			const color = '#fcba03';
			const noun = new Noun();
			const noun2 = new Noun({ hex: color });
			const noun3 = new Noun({ traits: { background: 2 }, hex: color });
			const noun4 = new Noun({ traits: { background: 2 } });

			expect(noun.hex).to.be.undefined;

			expect(noun2.seed.background).to.not.be.above(1);
			expect(noun2.hex).to.eq(color.replace('#', ''));

			expect(noun3.seed.background).to.eq(2);
			expect(noun3.hex).to.eq(color.replace('#', ''));

			expect(noun4.seed.background).to.eq(2);
			expect(noun4.hex).to.not.be.undefined;
		});

		it('should accept blank values', () => {
			const noun = new Noun({ traits: { head: 9000 } });
			const noun2 = new Noun({ traits: { head: 'none' } });
			const noun3 = new Noun({ traits: { head: 'n' } });

			expect(noun.seed.head).to.eq(9000);
			expect(noun2.seed.head).to.eq(9000);
			expect(noun3.seed.head).to.eq(9000);
		});

		it('should accept values for custom traits', () => {
			const noun = new Noun({ traits: { accessory: 9001 } });

			expect(noun.seed.accessory).to.eq(9001);
		});

		it('should return the correct seed for badublanc.eth', () => {
			const noun = new Noun({ text: 'badublanc.eth' });
			const noun2 = new Noun({
				text: 'badublanc.eth',
				hash: '0x01551850dc600d615058919289e281cfa89aafbd7bc113b53184f60ed0540340'
			});

			const s1 = Object.values(noun.seed).join(',');
			const s2 = Object.values(noun2.seed).join(',');
			const compareResult = s1 === s2;

			expect(compareResult).to.be.false;
			expect(noun.seed.background).to.eq(0);
			expect(noun.seed.body).to.eq(24);
			expect(noun.seed.accessory).to.eq(46);
			expect(noun.seed.head).to.eq(51);
			expect(noun.seed.glasses).to.eq(0);
		});

		it('should create a Noun for a random text input', () => {
			const name = faker.name.firstName();
			const noun = new Noun({ text: name });
			const noun2 = new Noun({ text: name });

			const result = JSON.stringify(noun) === JSON.stringify(noun2);

			expect(result).to.be.true;
		});

		it('should allow trait overrides for Nouns generated from text', () => {
			const name = faker.name.firstName();
			const noun = new Noun({ text: name });
			const newTrait = noun.seed.glasses === 20 ? 0 : noun.seed.glasses + 1;
			const noun2 = new Noun({ text: name, traits: { glasses: newTrait } });
			const noun3 = new Noun({ text: name, traits: { background: 2 } });

			const result = JSON.stringify(noun) === JSON.stringify(noun2);
			const result2 = JSON.stringify(noun) === JSON.stringify(noun3);

			expect(result).to.be.false;
			expect(result2).to.be.false;
			expect(noun3.hex).to.not.be.undefined;
		});
	});

	describe('Mass generation', () => {
		it('should generate classic Nouns without any inputs', () => {
			const arr: number[] = [];

			for (let i = 0; i < 1000; i++) {
				const noun = new Noun();
				arr.push(noun.seed.background);
			}

			const result = arr.filter((n) => n > 1);
			expect(result.length).to.eq(0);
		});

		it('should generate Nouns with random text inputs', () => {
			const cases = [];

			for (let i = 0; i < 200; i++) {
				cases.push(faker.name.firstName() + faker.name.lastName());
				cases.push(faker.lorem.word());
				cases.push(faker.internet.userName());
				cases.push(faker.company.companyName());
				cases.push(faker.animal.type());
			}

			const nouns = cases.map((c) => {
				return new Noun({ text: c });
			});
			const nouns2 = cases.map((c) => {
				return new Noun({ text: c, traits: { head: 50 } });
			});
			const nouns3 = cases.map((c) => {
				return new Noun({ text: c, traits: { background: 2 } });
			});

			nouns.forEach((n) => {
				expect(n.seed).to.have.all.keys(keys);
				expect(n.seed.background).to.not.be.above(1);
				expect(n.hex).to.be.undefined;
			});

			nouns2.forEach((n, i) => {
				expect(n.seed).to.have.all.keys(keys);
				expect(n.seed.head).to.eq(50);
				expect(n.seed.glasses).to.eq(nouns[i].seed.glasses);
			});

			nouns3.forEach((n, i) => {
				expect(n.seed).to.have.all.keys(keys);
				expect(n.seed.background).to.eq(2);
				expect(n.hex).to.not.be.undefined;
				expect(n.seed.glasses).to.eq(nouns[i].seed.glasses);
			});
		});
	});

	describe('Check bad values', () => {
		it('should not accept invalid inputs', () => {
			const result = () => {
				new Noun({ traits: { head: -1 } });
			};
			const result2 = () => {
				new Noun({ traits: { head: 1000 } });
			};
			const result3 = () => {
				new Noun({ traits: { head: 'zebra' } });
			};
			const result4 = () => {
				new Noun({ traits: { background: 2 }, hex: 'y3es' });
			};
			const result5 = () => {
				new Noun({ traits: { bg: 2 } });
			};
			const result6 = () => {
				new Noun({ traits: [0, 4, 2] });
			};
			const result7 = () => {
				new Noun({
					text: 'badublanc.eth',
					hash: '0x4108D8BAee23adE431b9321B3aB5b16493B6dbf2'
				});
			};
			const result8 = () => {
				// @ts-expect-error: confirm test will throw for invalid value
				new Noun({ style: 'lill' });
			};

			expect(result).to.throw('invalid_trait');
			expect(result2).to.throw('invalid_trait');
			expect(result3).to.throw('invalid_trait');
			expect(result4).to.throw('invalid_hex');
			expect(result5).to.throw('invalid_trait');
			expect(result6).to.throw('invalid_seed');
			expect(result7).to.throw('invalid_hash');
			expect(result8).to.throw('invalid_style');
		});
	});
});
