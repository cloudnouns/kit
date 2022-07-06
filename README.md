# 🌩 @cloudnouns/kit

![header](./static/header.png)

The best way to build with [Nouns](https://nouns.wtf) and [Lil Nouns](https://lilnouns.wtf). ⌐◨-◨

The CLOUDNOUNS Kit is a JavaScript library that makes creating Nouns dead simple.

- 🔥 Create \*any\* Noun or Lil Noun.
- 👩🏽‍🔬 Choose all, some, or no traits. Or make Nouns with invisible traits.
- 🟩 Customize background colors
- 💝 Compatible with any frontend framework (like React, Vue, and Svelte) or vanilla JS.

> **Note**: Check out the Cloud API for a hosted, URL-based version of this library. Perfect for designers and no-code based workflows. [Learn more ↗️](https://docs.cloudnouns.com).

## Quick start

Install with your favorite package manager...

```bash
npm install @cloudnouns/kit
# or
yarn add @cloudnouns/kit
```

... import into your project...

```js
import { Noun } from '@cloudnouns/kit';
```

... initialize...

```js
// random Noun
const noun = new Noun();
```

... and use generously.

```jsx
<img src={myNoun.images.svg} alt="noun" />
```

### Try it out

Use the CodeSandbox links below to try out the library:

- [React](https://codesandbox.io/s/kit-example-react-7wgzhy)
- [Svelte](https://codesandbox.io/s/kit-example-svelte-87vekr)
- [Vue](https://codesandbox.io/s/kit-example-vue-2vuvkr)

For more information, check out [our documentation](https://docs.cloudnouns.com).

## Props

Each prop is optional. If no props are provided, a random Noun will be generated and returned.

| prop   | type                | default                                                              |
| ------ | ------------------- | -------------------------------------------------------------------- |
| style  | `string`            | `classic`                                                            |
| traits | `object` or `array` | n/a                                                                  |
| text   | `string`            | n/a                                                                  |
| hash   | `string`            | `0xcc60b76e3f2389009a480d62ceddae8091b46b86bb8d0370206a49e9edf9cd16` |
| hex    | `string`            | n/a                                                                  |
| size   | `number`            | `320`                                                                |

### Example usage

#### `style`

```js
// classic Noun
const noun = new Noun();
const noun2 = new Noun({ style: 'classic' });

// lil Noun
const lilnoun = new Noun({ style: 'lil' });
```

#### `traits`

```js
// object. each trait is optional.
// unspecified traits are chosen at random.
const noun = new Noun({
	traits: {
		background: 1,
		body: 15,
		accessory: 94,
		head: 138,
		glasses: 5
	}
});

// invisible traits
const noun2 = new Noun({
	traits: {
		accessory: 'n',
		head: 'n'
	}
});

// array. must include 5-valid values.
const noun3 = new Noun({ traits: [1, 15, 94, 138, 5] });

// invisible traits
const noun4 = new Noun({ traits: [1, 15, 9000, 9000, 5] });
```

#### `text`

```js
// will always return the same Noun for a given string.
// below examples return 3 different Nouns
const noun = new Noun({ text: 'Badu Blanc' });
const noun2 = new Noun({ text: 'badublanc.eth' });
const noun3 = new Noun({ text: '@badublanc' });
```

#### `hash`

```js
// changes the hash used for Noun generation.
// must be a 0x-prefixed, valid, bytes32 hash.
// this prop is ignored without the text prop.
const ignored = new Noun({
	hash: '0x241aa473a95cb34fa4dc2d2c9b294ce9cc29a48b791f496b82341b937503fa69'
});

// produces two different Nouns due to hash, despite having same string
const noun = new Noun({ text: 'Badu Blanc' });
const noun2 = new Noun({
	text: 'Badu Blanc',
	hash: '0x241aa473a95cb34fa4dc2d2c9b294ce9cc29a48b791f496b82341b937503fa69'
});
```

#### `hex`

```js
// any valid hex color string
// ignored unless background is 2
const ignored = new Noun({ hex: 'c0fca6' });

const noun = new Noun({ traits: { background: 2 }, hex: 'c0fca6' });
const noun2 = new Noun({ traits: [2, 15, 3, 72, 10], hex: '79d4e0' });
```

#### `size`

```js
const small = new Noun({ size: 100 });
const large = new Noun({ size: 1000 });
```

### Combining props

```js
const customNoun = new Noun({
	traits: { background: 2, body: 13, accessory: 9, head: 23, glasses: 7 },
	hex: 'c0fca6',
	style: 'lil',
	size: 750
});
```
