import Node from '../Node'
import cm from '../CommunicationManager'
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
	updateUI() {
		
		this.c2.style("fill", function(d) {
			var selectedEnterprise = cm.getStoreValue("OrchestrationReducer", "selectedEnterprise")
			if (selectedEnterprise==d.id) {	
				console.log("color:"+cm.selInnerColor)
				return cm.selInnerColor
			} else {
				return d.innerColor;
			}
			
		})  
		
	}
}