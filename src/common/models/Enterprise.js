import Node from '../Node'

export default class Enterprise extends Node{
	constructor(data, r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH) {
		super(r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH, data.BusinessName, data.Icon, );
		this.id = data.EnterpriseId;
		this.type = "Enterprise";
		this.data = data;
		this.branchMap = {};
		this.nodes = [];
		this.links = [];
	}
}