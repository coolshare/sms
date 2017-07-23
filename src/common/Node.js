import cm from './CommunicationManager'

export default class Node {
	constructor(r, xx, yy, fontDy, state, innerColor, iconX, iconY, iconW, iconH, label, icon) {
		this.label = label;
		this.r = r;
		this.xx = xx;
		this.yy = yy;
		this.icon = icon;
		this.fontDy = fontDy;
		this.state = state;
		this.innerColor = innerColor;
		this.iconX = iconX;
		this.iconY = iconY;
		this.iconW = iconW;
		this.iconH = iconH;
	}
	
	updateSelected(isSelected) {
		if (this.c2) {
			this.c2.style("fill", function(d) {				
				if (isSelected) {								
					return cm.selInnerColor
				} else {
					return d.innerColor;
				}
				
			})  
		}
		
		
	}
}