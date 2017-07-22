import Node from '../Node'
import cm from '../CommunicationManager'
export default class Branch extends Node {
	constructor(data, r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH) {
			super(r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH, data.BusinessName, data.Icon);
			this.id = data.BranchId;
			this.type = "Branch";
			this.data = data;
	}
	updateUI() {
		this.c2.style("fill", function(d) {
			var selectedBranch = cm.getStoreValue("OrchestrationReducer", "selectedBranch")
			if (selectedBranch==d.id) {								
				return cm.selInnerColor
			} else {
				return d.innerColor;
			}
			
		})  
		
	}
}