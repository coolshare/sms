export default class Provider {
	constructor() {
		this.enterpriseMap = {};
		this.nodes = [];
		this.linkMap = {};
		this.dirty = true;
	}
}