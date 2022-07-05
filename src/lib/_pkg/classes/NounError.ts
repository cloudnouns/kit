export class NounError extends Error {
	constructor({
		type = 'invalid_argument',
		msg = 'Bad request. Please check arguments.'
	}) {
		super(`${type}. ${msg}`);
		this.name = 'NounError';
	}
}
