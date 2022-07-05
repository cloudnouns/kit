const blankTrait = {
	id: 9000,
	filename: 'blank-trait',
	label: 'Blank Trait',
	data: '0x0000000000'
};

export default {
	palette: [''],
	images: {
		backgrounds: [
			{
				id: 9000,
				filename: 'blank-bg',
				label: 'Blank Background',
				data: 'none'
			}
		],
		bodies: [blankTrait],
		accessories: [blankTrait],
		heads: [blankTrait],
		glasses: [blankTrait]
	}
};
