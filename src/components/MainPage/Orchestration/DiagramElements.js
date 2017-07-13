import * as d3 from "d3";

class Node {
	constructor(parent, n, state, options){
		options = options||{};
		this.parent = parent;
		this.node = n;
		this.label = options.label?options.label:(this.node&& this.node.Name?this.node.Name:("label_"+(++parent.idCount)));	;
		this.state = state;
		this.id = options.id?options.id:(this.node&& this.node.id?this.node.id:("id_"+(++parent.idCount)));
		this.innerColor = "#929292"
	}
	filterMenu = function() {
		let mm = Object.assign([], this.menu);
		let res = [];
		
		return mm;
	}
	createMenu = function() {
		var menu = this.filterMenu();
        // create the div element that will hold the context menu
        d3.selectAll('.context-menu').data([1])
          .enter()
          .append('div')
          .attr('class', 'context-menu');
        // close menu
        d3.select('body').on('click.context-menu', function() {
          d3.select('.context-menu').style('display', 'none');
        });
        // this gets executed when a contextmenu event occurs
        d3.selectAll('.context-menu')
          .html('')
          .append('ul')
          .selectAll('li')
            .data(menu).enter()
            .append('li')
            .text(function(d) { 
            	return d[0]; 
            })
            .style("color",function(d) { 
            	return d[1]==="disabled"?"gray":"black"; 
            })
            .style("cursor",function(d) { 
            	return d[1]==="disabled"?"default":"pointer"; 
            })
            
        .on('click' , function(d) { 
        	self.handleMenu(d); 
        	if (d[1]!=="disabled") {
        		d3.select('.context-menu').style('display', 'none');
        	}
        	
        	return d; 
        })
        //.text(function(d) { return d; });
        d3.select('.context-menu').style('display', 'none');
        // show the context menu
        if (menu.length>0) {
        	d3.select('.context-menu')
            .style('left', (d3.event.pageX - 2) + 'px')
            .style('top', (d3.event.pageY - 2) + 'px')
            .style('display', 'block');
        }
        
        d3.event.preventDefault();
    }
}

export class DomainNode extends Node {
	constructor(parent, n, state, options) {
		super(parent, n, state, options);
		this.image = this.node.CloudProvider?this.node.CloudProvider.toLowerCase():null;
		this.nType = "Domain"
		this.r = 30;
		this.iconX = -10;
		this.iconY = -10;
		this.fontDy = "0.55em";
	}
}

export class HostNode extends DomainNode {
	constructor(parent, n, state, options) {
		super(parent, n, state, options);
		this.image = this.node.CloudProvider?this.node.CloudProvider.toLowerCase():null;
		this.nType = "Domain"
		this.r = 20;
		this.iconW = 15;
		this.iconH = 15;
		this.iconX = -10;
		this.iconY = -10;
		this.fontDy = "2.55em";
		this.innerColor = "#99b3ff" 
	}
}

export class PodNode extends Node {
	constructor(parent, n, state, options) {
		super(parent, n, state, options);
		this.image = this.node.CloudProvider?this.node.CloudProvider.toLowerCase():null;
		this.nType = "Pod"
		this.r = 20;
		this.iconW = 15;
		this.iconH = 15;
		this.iconX = -10;
		this.iconY = -10;
		this.fontDy = "2.55em";
		this.menu = [["Lower latency to less than 2 sec"], ["Lower cost to available lowest rate"], ["Migrate to an environment with lower latency"]];
	}
	

}

export class InternetNode extends Node {
	constructor(parent, n, state, options) {
		super(parent, n, state, options);
		this.image = this.node.CloudProvider?this.node.CloudProvider.toLowerCase():null;
		this.nType = "Internet"
		this.r = 10;
		this.iconW = 50;
		this.iconH = 50;
		this.iconX = -30;
		this.iconY = -30;
		this.fontDy = "2.55em";
	}
}	
export class UserNode extends Node {
	constructor(parent, n, state, options) {
		super(parent, n, state, options);
		this.image = this.node.CloudProvider?this.node.CloudProvider.toLowerCase():null;
		this.nType = "User"
		this.r = 10;
		this.iconW = 50;
		this.iconH = 50;
		this.iconX = -30;
		this.iconY = -30;
		this.fontDy = "2.55em";
	}
}

