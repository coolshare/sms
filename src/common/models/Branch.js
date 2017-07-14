import Node from '../Node'

export default class Branch extends Node {
	constructor(data, r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH) {
			super(r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH, data.BranchName, data.Icon);
			this.id = data.id;
			this.type = "Branch";
			this.data = data;
	}

}