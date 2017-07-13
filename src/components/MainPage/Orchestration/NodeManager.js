import ReactDOM from 'react-dom'
import * as d3 from "d3";
import Utils from '../../../common/Utils'
import cm from '../../../common/CommunicationManager'
import style from './Orchestration.css'

const expandW=10, expandH = 10;
class Node {
	static diagramMenu = null
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		options = options||{};
		this.container = container;
		this.parent = parent;
		this.data = data;
		this.svg = svg;
		this.node = n;
		this.nType = nType;
		this.l = l;
		this.showTips = this.l && this.l.length>12
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c = options.c||"#E1E1E1";
		this.id = options.id?options.id:(this.node&& this.node.id?this.node.id:("id_"+(++container.idCount)));
		this.children = [];
		if (this.parent!==null) {
			this.parent.children.push(this)
		}
		if (this.nType) {
			
			container.nodeMap[this.id] = this;
			if (this.node) {
				container.elemNodeMap[this.node.id] = this;
			}
			
			console.log("id="+this.id+" keys=="+this.node.Name+"==="+Object.keys(container.nodeMap).length)
		}
		this.childLinks = [];
		this.parentLinks = []
	}
	contains = function(x1, y1, x2, y2, type) {
		if (this.nType != type && type != undefined) {
			return false;
		}

		return Math.max(x1, this.x1) < Math.min(x1+x2, this.x1+this.x2) &&
			          Math.max(y1, this.y1) < Math.min(y1+y2, this.y1+this.y2);
		/*
		var x11 = x1, y11 = y1, x12 = x1 + x2, y12 = y1 + y2, x21 = this.x1, y21 = this.y1, x22 = this.x1
				+ this.x2, y22 = this.y1 + this.y2;
		
		//console.log( "x11 = "+x1+", y11 ="+ y1+", x12 = "+(x1 + x2)+", y12 = "+(y1 + y2)+", x21 = "+this.x1+", y21 = "+this.y1+", x22 = "+(this.x1+ this.x2)+", y22 = "+(this.y1 + this.y2))
		var x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
		var y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
		return x_overlap * y_overlap > 0;*/
	}
	
	highlight(h) {
		let textColor = "#4682b4", borderWidth = "1px";
		
		if (h) {
			textColor = "#000"
			borderWidth = "2px" 
				
		}
		let borderColor = "#4682b4";
		if (h) {
			borderColor = "#000"
		}
		this.textElement.style("fill", textColor)
		this.rectElement.style("stroke", borderColor).style('stroke-width',borderWidth);
	}
	
	filterMenu = function(m, elem) {
		let mm = Object.assign([], m);
		let res = [];
		if (this.node.Type!=="Node") {
			return res;
		}
		for (let i=0; i<mm.length; i++) {
			let item = mm[i];
			if (this.container.isAddingLink && item==="Start A Link") {
				continue;
			}
			if (!this.container.isAddingLink && item==="Connect A Link" ) {
				continue;
			}
			
			if (this.container.isAddingLink && item==="Connect A Link" && elem.cursor==="no-drop") {
				continue;
			}
			res.push(item)
		}
		return res;
	}
	
	static createMenu = function(self, d,i, menu) {
		menu = self.filterMenu(menu, self);
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
	
	handleSelection(selected) {
		let fillColor = "#4682b4";
		if (selected) {
			fillColor = "black"
		}
		this.container.selectedNode.highlightRelation(selected);
		this.container.selectedNode.highlight(selected)
	}
}

class DiagramNode extends Node{
	
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		super(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options);
		this.menu = ["Start A Link", "Connect A Link"];
	}
	handleClick() {
		cm.dispatch({"type":"selectOrchestrationNode", "data":null})
		//this.doNodeSelection();
		cm.dispatch({"type":"selectOrchestrationNode", "data":this.node})
	}
	
	doNodeSelection() {
		if (this.container.selectedNode) {
			this.container.selectedNode.handleSelection(false);
		}
		
		this.node.showETCD = false;
		this.node.showMaster = false;
		this.container.selectedNode = this;
		this.container.selectedNode.rectElement.attr("fill", "#4682b4")
		if (d3.event) {
			d3.event.stopPropagation();
		}
		
		this.container.selectedNode.handleSelection(true);
	}
	
	handleExpandClick() {
		this.node.ExpandState = 1-this.node.ExpandState;
		cm.dispatch({"type":"expandOrchestrationNode", "data":Object.assign({}, this.data)})
		d3.event.stopPropagation();
	}
	
	highlightRelation(hightlight, options) {
		if (options===undefined || options.down) {
			for (let i=0; i<this.childLinks.length; i++) {
				let link = this.childLinks[i];
				link.highlight(hightlight)
				link.node2.highlightRelation(hightlight, {"down":true})
				
			}
		}
		
		if (options===undefined || options.up) {
			for (let i=0; i<this.parentLinks.length; i++) {
				let link = this.parentLinks[i];
				link.highlight(hightlight)
				link.node1.highlightRelation(hightlight, {"up":true})
			}
		}
	}
	
	handleMenu(d) {
		let self = this;
		if (d==="Start A Link") {			
			let e = d3.event;
			//console.log("e.x="+e.x+" e.y="+e.y)
			this.container.isAddingLink = true;
			this.container.pendingLink = new Link(this.container, this.svg, this, new DiagramNode(this.container, null, {}, this.svg, null, null, null, e.x, e.y-80, this.x2, this.y2))
			this.container.pendingLink.create();
			this.container.pendingLink.isPending = true;
			this.container.selectedNode = this;
			this.container.dragHandler = function(e) {
				self.container.pendingLink.node2.x1 = e.x;
				self.container.pendingLink.node2.y1 = e.y;
				self.container.pendingLink.update();
				let tn = findContainer(self.container.pendingLink.node2, self.node.ChildType);
				console.log("x1="+self.container.pendingLink.node2.x1+" y1="+self.container.pendingLink.node2.y1)
				
				if (tn && self.container.pendingLink.node1.node.ChildType==tn.node.Type && self.container.linkMap[self.container.pendingLink.node1.id+"_"+tn.id]===undefined) {
					console.log("tn==================>"+tn.Name)
					tn.cursor = "drop";
					tn.rectElement.style("cursor", "drop")
					tn.textElement.style("cursor", "drop")
				} else {
					if (tn) {
						tn.cursor = "no-drop";
						tn.rectElement.style("cursor", "no-drop")
						tn.textElement.style("cursor", "no-drop")
					} else {
						self.container.state.diagram.style("cursor", "no-drop")
					}
					
				}
			}
		} else if (d==="Connect A Link") {
			this.container.isAddingLink = false;
			cm.dispatch({"type":"addLink", "data":{"node1":this.container.pendingLink.node1.node, "node2":this.node}})
			
			this.container.pendingLink.remove();		
			this.container.dragHandler = null;
			delete this.container.pendingLink;
			this.container.state.diagram.style("cursor", "default")
		}
	}
	create() {
		let self = this;
		this.rectElement = this.svg.append("rect")
	      .attr("id", this.id)
	      .style("fill", this.c)
	      .style("stroke", "#4682b4")
	      .style("cursor", "pointer")
	      .on("click", function() {
	    	  self.handleClick.apply(self);
	      }).attr("width", this.x2)
		      .attr("height", this.y2)
		      .attr("x", this.x1)
		      .attr("y", this.y1)
			.on("mouseover", function(d) {
	  		  if (self.container.pendingLink && (self.container.selectedNode==self || self.container.selectedNode.node.ChildType!==self.node.Type)) {
	  			  self.textElement.style("cursor", "no-drop")
		    	  self.rectElement.style("cursor", "no-drop")
		    	  d3.event.stopPropagation();
  			  	  return;
	  		  }
			})
			.on("mouseout", function() {
					if (self.container.pendingLink) {
						self.textElement.style("cursor", "pointer")
				    	self.rectElement.style("cursor", "pointer")
					}
					
					d3.event.stopPropagation();
			   })
		this.textElement = this.svg.append("text")
			  .text(this.l.length<12?this.l:this.l.substring(0, 11)+"...")
			  .style("fill", "#4682b4")
		      .attr("x", this.x1+3)
		      .attr("y", this.y1+3*this.y2/5)
		      .style("cursor", "pointer")
		      .on("click", function() {
		    	  self.handleClick.apply(self);
		      })
	    	  .on("mouseover", function(d) {
	    		  if (self.container.pendingLink && (self.container.selectedNode==self || self.container.selectedNode.node.ChildType!==self.node.Type)) {
	    			  self.textElement.style("cursor", "no-drop")
			    	  self.rectElement.style("cursor", "no-drop")
	    		  }
	    		  if (!self.showTips) {
	    			  d3.event.stopPropagation();
	    			  return;
	    		  }
	    		  //var xPosition = parseFloat(d3.select(this).attr("x"));
	    		  //var yPosition = parseFloat(d3.select(this).attr("y"));
	    		  d3.select("#orchestTooltip")
						.style("left", (self.x1+self.x2) + "px")
						.style("top", self.y1 + "px")
						.select("#value")
						.text(self.l);
	    		  d3.select("#orchestTooltip").classed("hidden", false);
	    		  d3.event.stopPropagation();
			   })
			   .on("mouseout", function() {
					d3.select("#orchestTooltip").classed("hidden", true);
					if (self.container.pendingLink) {
						self.textElement.style("cursor", "pointer")
				    	self.rectElement.style("cursor", "pointer")
					}
					
					d3.event.stopPropagation();
			   })
	    if (this.menu) {
	    	self.rectElement.on('contextmenu', (function(menu) {
	    		return function(d, i) {
	    			Node.createMenu(self, d, i, menu);
	    		}
	    	})(self.menu));
	    	self.textElement.on('contextmenu', (function(menu) {
	    		return function(d, i) {
	    			Node.createMenu(self, d, i, menu);
	    		}
	    	})(self.menu));
	    	
	    }
	    if (this.node.ExpandState!==undefined && this.expandable) {
	    	this.boxElement = this.svg.append("rect")
		      .attr("id", "box_"+this.id)
		      .style("fill", this.c)
		      .style("stroke", "#4682b4")
		      .style("cursor", "pointer")
		      .attr("width", expandW)
		      .attr("height", expandH)
		      .attr("x", this.x1+this.x2)
		      .attr("y", this.y1+(this.y2-expandH)/2)
		      .on("click", function() {
		    	  self.handleExpandClick.apply(self);
		      })
		    this.boxTextElement = this.svg.append("text")
			  .text(this.node.ExpandState==0?"+":"-")
		      .attr("x", this.x1+this.x2+2)
		      .attr("y", this.y1+(this.y2+6*expandH/7)/2)
		      .style("cursor", "pointer")
		      .on("click", function() {
	    	  self.handleExpandClick.apply(self);
	      })
	    }
	}
}

//================ Concrete Nodes =============================

class CPNode extends DiagramNode{
	
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		super(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options);	
		this.menu = [];
	}
	filterMenu = function(m, elem) {
		let mm = Object.assign([], m);
		let res = [];
		
		return mm;
	}
	handleMenu(d) {
		let self = this;
		if (d[0]==="Paste") {		
			
		}
	}
	
	handleInnerClick (elem) {
		this.node.showMaster = this.node.showETCD = false;
		cm.dispatch({"type":"selectOrchestrationNode", "data":null})
		this.node["show"+elem] = true;
		cm.dispatch({"type":"selectOrchestrationNode", "data":this.node})
	}
	
	create() {
		var self = this;
		super.create();
		if (this.node.ETCD) {
			this.ETCD = this.svg.append("rect")
		      .style("fill", this.node.ETCD.state?"green":"red")
		      .style("stroke", "#4682b4")
		      .style("cursor", "default")
		      .attr("width", this.x2/6)
			      .attr("height", this.y2/3)
			      .attr("x", this.x1+this.x2-this.x2/6)
			      .attr("y", this.y1)
			      .on("mouseover", function(d) {
		    		  var s = self.node.ETCD.state?"Healthy":"Problematic";
		    		  d3.select("#orchestTooltip")
							.style("left", function(){
								return (self.x1+self.x2+self.container.libW) + "px"
							})
							.style("top", (self.y1+40) + "px")
							.select("#value")
							.text("ETCD:"+s);
		    		  d3.select("#orchestTooltip").classed("hidden", false);
		    		  d3.event.stopPropagation();
				   })
				   .on("mouseout", function() {
						d3.select("#orchestTooltip").classed("hidden", true);
						d3.event.stopPropagation();
				   })
				   .on("click", function() {
					   self.handleInnerClick.apply(self, ["ETCD"]);
				   }).style("cursor", "pointer")
		}
		if (this.node.Master) {
			this.Master = this.svg.append("circle")
		      .style("fill", this.node.Master.state?"green":"red")
		      .style("stroke", "#4682b4")
		      .style("cursor", "default")
		      .attr("r", this.x2/12)
			      .attr("cx", this.x1+this.x2-this.x2/12)
			      .attr("cy", this.y1+this.y2-this.x2/12)
			      .on("mouseover", function(d) {
		    		  var s = self.node.Master.state?"Healthy":"Problematic";
		    		  d3.select("#orchestTooltip")
							.style("left", function(){
								return (self.x1+self.x2+self.container.libW) + "px"
							})
							.style("top", (self.y1+40) + "px")
							.select("#value")
							.text("Master:"+s);
		    		  d3.select("#orchestTooltip").classed("hidden", false);
		    		  d3.event.stopPropagation();
				   })
				   .on("mouseout", function() {
						d3.select("#orchestTooltip").classed("hidden", true);
						d3.event.stopPropagation();
				   })
				   .on("click", function() {
					   self.handleInnerClick.apply(self, ["Master"]);
				   })
				   .style("cursor", "pointer")
		}
			
	}
}	

class NodeNode extends DiagramNode{
	
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		super(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options);
		this.menu = [["Add A Pod"], ["Copy", "disabled"], ["Cut", "disabled"], ["Paste"], ["Edit", "disabled"], ["Delete", "disabled"]];
	}
	filterMenu = function(m, elem) {
		let mm = Object.assign([], m);
		let res = [];
		if (!this.container.menuAction) {
			mm[3][1] = "disabled"
		} 
		return mm;
	}
	handleMenu(d) {
		let self = this;
		if (d[0]==="Copy") {		
			this.container.srcNode = self;
			this.container.menuAction = "Copy"
		} else if (d[0]==="Cut") {		
			this.container.srcNode = self;
			this.container.menuAction = "Cut"
		}else if (d[0]==="Paste") {		
			cm.dispatch({"type":"NodeService", "action":this.container.menuAction+this.node.ChildType, "src":this.container.srcNode.node, "tar":this.node, "orchestrationData":this.container.orchestrationData})
			this.container.menuAction = null;
		}
	}
}	

class PodNode extends DiagramNode{
	
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		super(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options);
		this.menu = [["Copy"], ["Cut"], ["Edit", "disabled"], ["Delete", "disabled"]];
	}
	filterMenu = function(m, elem) {
		let mm = Object.assign([], m);
		let res = [];
		
		return mm;
	}
	handleMenu(d) {
		let self = this;
		if (d[0]==="Copy") {		
			this.container.srcNode = self;
			this.container.menuAction = "Copy"
		} else if (d[0]==="Cut") {		
			this.container.srcNode = self;
			this.container.menuAction = "Cut"
		}
	}
}	

class LibNode extends Node{
	
	constructor(container, parent, data, svg, n, nType, l, x1, y1, x2, y2, options){
		super(container, parent, data, svg, n, null, l, x1, y1, x2, y2, options);
		options = options||{};
		this.isLib = true;
		this.targetType = "Master";
		this.dx = 3;
		this.dy = 3*this.y2/5;
		this.cursor = "move";
	}
	
	create(isInsert) {
		let self = this;
		var ddd = [ {
			"x" : this.x1,
			"y" : this.y1,
			"node" : this
		} ];
		this.rectElement = this.svg.append("rect")
	      .attr("id", this.id)
	      .data(ddd)
	      .attr("x", this.x1)
		  .attr("y", this.y1)
	      .style("fill", this.c)
	      .style("stroke", "#4682b4")
	      .style("cursor", "move")
	      .attr("width", this.x2)
		      .attr("height", this.y2)
		      .call(drag)
		this.textElement = this.svg.append("text")
			  .text(this.l)
			  .data(ddd)
		      .attr("x", this.x1+this.dx)
		      .attr("y", this.y1+this.dy)
		      .style("cursor", "move")
		      .call(drag)
	}
	clone() {
		var id = Utils.getId();
		var cNode = new LibNode(this.container, null, this.data, this.svg, this.node,
				this.nType, this.l, this.x1, this.y1, this.x2, this.y2, {"c":this.c, "id":this.id});
		this.container.nodeMap[id] = cNode;
		if (cNode.node) {
			this.container.elemNodeMap[cNode.node.id] = cNode;
		}
		cNode.tips = this.tips

		//huawei.createShape[this.shape](this.$scope, huawei.libCanvas, cNode);
		//huawei.libItems.push(cNode);
		cNode.create();
		return cNode;
		
	}
	remove() {
		if (this.rectElement) {
			this.rectElement.remove();
		}
		if (this.textElement) {
			this.textElement.remove();
		}

		var n = this;
		n.container.nodeMap[n.id] = undefined;
		if (n.node) {
			n.container.elemNodeMap[n.node.id] = undefined;
		}
		if (n.node) {
			delete n.container.nodeMap[n.node.id];
		}
		delete n.container.nodeMap[n.id];
		
	}
	
	dragEndHandler(c) {
		let idCount = ++c.container.idCount;
		let newNode = {"id":"id_"+idCount, "pid":c.node.id, "Name":"Node"+idCount,"Type":"Node", "Properties":{"p1":"111", "p2":"111111"}}
		cm.dispatch({"type":"addNode", "data":{"node1":c.node, "node2":newNode}})
		
	}
}
class Link {
	constructor(container, svg, node1, node2, options){
		options = options||{};
		this.container = container;
		this.svg = svg;
		this.node1 = node1;
		this.node2 = node2;
		this.c = options.c===undefined?"#4682b4":options.c;
		this.id = options.id!==undefined?options.id:this.getId();
		this.dx = options.dx===undefined?5:options.dx;
		this.dy = node1.y1===node2.y1?0:options.dy===undefined?5:options.dy;	
		this.container.linkMap[this.id] = this;
		this.menu = ["Delete This Link"];
		node1.childLinks.push(this);
		node2.parentLinks.push(this);
	}
	getId() {
		return this.node1.id+"_"+this.node2.id;
	}
	handleMenu(d) {
		let self = this;
		if (d==="Delete This Link") {			
			//let e = d3.event;
			cm.dispatch({"type":"removeLink", "data":{"node1":this.node1.node, "node2":this.node2.node}})
			this.container.state.diagram.style("cursor", "default")
		}
	}
	filterMenu = function(m, elem) {
		let mm = Object.assign([], m);
		let res = [];
		for (let i=0; i<mm.length; i++) {
			let item = mm[i];

			res.push(item)
		}
		return res;
	}
	create() {
		let self = this;
		this.line1 = this.svg.append("line")
		.attr("id", this.id+"|1")
		.style("stroke", this.c)
		.style("stroke-width", 2)
		.attr("x1", this.node1.x1+this.node1.x2+expandW)
		.attr("y1", this.node1.y1+this.node1.y2/2)
		.attr("x2", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("y2", this.node1.y1+this.node1.y2/2)

		if (this.highlighted) {
			this.line1.style("stroke", this.c)
		} else {
			this.line1.style("stroke-dasharray", ("10,3"))
		}
		if(!this.container.isAddingLink) {
			this.circle1 = this.svg.append("circle")
			.attr("cx", this.node1.x1+this.node1.x2+this.dx+expandW)
			.attr("cy", this.node1.y1+this.node1.y2/2)
			.attr("r", 3)
			.attr("fill", "#4682b4")
		}
		
		this.line2 = this.svg.append("line")
		.attr("id", this.id+"|2")	
		.style("stroke", this.c)
		.style("stroke-width", 2)
		.attr("x1", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("y1", this.node1.y1+this.node1.y2/2)
		.attr("x2", this.node1.x1+this.node1.x2+this.dx+expandW)
		.style("cursor", "pointer")

		let y2;
		if(this.container.isAddingLink) {
			y2 = this.node2.y1
		} else {	
			y2 = this.node2.y1+this.node2.y2/2+this.dy
		}
		if (this.highlighted) {
			this.line2.style("stroke", this.c)
		} else {
			this.line2.style("stroke-dasharray", ("10,3"))
		}
		this.line2.attr("y2", y2)
		
		if(!this.container.isAddingLink) {
			this.circle1 = this.svg.append("circle")
			.attr("cx", this.node1.x1+this.node1.x2+this.dx+expandW)
			.attr("cy", y2)
			.attr("r", 3)
			.attr("fill", "#4682b4")
		}
		
		this.line3 = this.svg.append("line")
		.attr("id", this.id+"|3")		
		.style("stroke-width", 2)
		.style("stroke", this.c)
		.attr("x1", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("x2", this.node2.x1)
		.style("cursor", "pointer")

		
		if(this.container.isAddingLink) {
			this.line3.attr("y1", this.node2.y1)
			this.line3.attr("y2", this.node2.y1)
		} else {
			this.line3.attr("y1", this.node2.y1+this.node1.y2/2+this.dy)
			this.line3.attr("y2", this.node2.y1+this.node2.y2/2+this.dy)
		}
		if (this.highlighted) {
			this.line3.style("stroke", this.c)
		} else {
			this.line3.style("stroke-dasharray", ("10,3"))
		}
		
		if (this.menu) {
			this.line2.on('contextmenu', (function(menu) {
	    		return function(d, i) {
	    			Node.createMenu(self, d, i, menu);
	    		}
	    	})(self.menu));
			this.line3.on('contextmenu', (function(menu) {
	    		return function(d, i) {
	    			Node.createMenu(self, d, i, menu);
	    		}
	    	})(self.menu));
	    	
	    }
		
	}
	
	create2() {
		let x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6;
		x1 = this.node1.x1+this.node1.x2+expandW
		y1 = y2 = y3 = this.node1.y1+this.node1.y2/2
		x2 = x3 = x4 = x5 = this.node1.x1+this.node1.x2+this.dx+expandW		
		if(this.isPending) {
			y4 = this.node2.y1
		} else {
			y4 = this.node2.y1+this.node2.y2/2+this.dy
		}
		x6 = this.node2.x1
		if(this.isPending) {
			y5 = this.node2.y1
			y6 = this.node2.y1
		} else {
			y5 = this.node2.y1+this.node1.y2/2+this.dy
			y6 = this.node2.y1+this.node2.y2/2+this.dy
		}
		
		
		this.line1 = this.svg.append("line")
		.attr("id", this.id+"_1")	
		.style("stroke", this.c)
		.attr("x1", x1)
		.attr("y1", y2)
		.attr("x2", x2)
		.attr("y2", y2)
		if (this.highlighted) {
			this.line1.style("stroke", this.c)
		} else {
			this.line1.style("stroke-dasharray", ("10,3"))
		}
		/*
		this.circle1 = this.svg.append("circle")
		.attr("cx", x2)
		.attr("cy", y2)
		*/
		this.line2 = this.svg.append("line")
		.attr("id", +"_2")
		.style("stroke", this.c)
		.attr("x1", x3)
		.attr("y1", y3)
		.attr("x2", x4)
		.attr("y2", y4)
		
		if (this.highlighted) {
			this.line2.style("stroke", this.c)
		} else {
			this.line2.style("stroke-dasharray", ("10,3"))
		}
		/*
		this.circle2 = this.svg.append("circle")
		.attr("cx", x4)
		.attr("cy", y4)
		*/
		this.line3 = this.svg.append("line")
		.attr("id", +"_3")
		.style("stroke", this.c)
		.attr("x1", x5)
		.attr("y5", y5)
		.attr("x2", x6)
		.attr("y6", y6)

		if (this.highlighted) {
			this.line3.style("stroke", this.c)
		} else {
			this.line3.style("stroke-dasharray", ("10,3"))
		}
		
	}
	
	update() {
		this.line1
		.attr("x1", this.node1.x1+this.node1.x2+expandW)
		.attr("y1", this.node1.y1+this.node1.y2/2)
		.attr("x2", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("y2", this.node1.y1+this.node1.y2/2)
		
		if(!this.container.isAddingLink) {
			this.circle1 = this.svg.append("circle")
			.attr("cx", this.node1.x1+this.node1.x2+this.dx+expandW)
			.attr("cy", this.node1.y1+this.node1.y2/2)
			.attr("r", 2)
			.attr("fill", "#4682b4")
		}
		
		this.line2
		.attr("x1", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("y1", this.node1.y1+this.node1.y2/2)
		.attr("x2", this.node1.x1+this.node1.x2+this.dx+expandW)
		let y2;
		if(this.container.pendingLink.isPending) {
			y2 = this.node2.y1
		} else {
			y2 = this.node2.y1+this.node2.y2/2+this.dy
		}
		this.line2.attr("y2", y2)
		
		if(!this.container.isAddingLink) {
			this.circle1 = this.svg.append("circle")
			.attr("cx", this.node1.x1+this.node1.x2+this.dx+expandW)
			.attr("cy", y2)
			.attr("r", 2)
			.attr("fill", "#4682b4")
		}
		
		this.line3
		.attr("x1", this.node1.x1+this.node1.x2+this.dx+expandW)
		.attr("x2", this.node2.x1)
		
		if(this.isPending) {
			this.line3.attr("y1", this.node2.y1)
			this.line3.attr("y2", this.node2.y1)
			//console.log("y2="+(this.node2.y1))
			//console.log("ny2="+(this.node2.y1))
		} else {
			this.line3.attr("y1", this.node2.y1+this.node1.y2/2+this.dy)
			this.line3.attr("y2", this.node2.y1+this.node2.y2/2+this.dy)
			//console.log("y2="+(this.node2.y1+this.node2.y2/2+this.dy))
			//console.log("ny2="+(this.node2.y1))
		}
		
		
	}
	highlight(isHighlight) {
		if (isHighlight) {
			this.line1.attr("stroke", "blue").style("stroke-width", 4).style("stroke-dasharray", null)
			this.line2.attr("stroke", "blue").style("stroke-width", 4).style("stroke-dasharray", null)
			this.line3.attr("stroke", "blue").style("stroke-width", 4).style("stroke-dasharray", null)
		} else {
			this.line1.attr("stroke", this.c).style("stroke-dasharray", ("10,3")).style("stroke-width", 2)
			this.line2.attr("stroke", this.c).style("stroke-dasharray", ("10,3")).style("stroke-width", 2)
			this.line3.attr("stroke", this.c).style("stroke-dasharray", ("10,3")).style("stroke-width", 2)
		}
		
	}
	remove() {
		this.line1.remove();
		this.line2.remove();
		this.line3.remove();
	}
	restore() {
		this.container.nodeMap[this.node1.id].handleMenu("Start A Link")
	}
}

class NodeManager {
	constructor () {
		this.nodeLoader = {"loadOrchestrationContainerTest":this.loadOrchestrationContainerTest, "loadOrchestrationContainer":this.loadOrchestrationContainer};
		this.container = null;
	}
	
	selectNode(node) {
		if (!node) {
			return;
		}
		
		this.container.elemNodeMap[node.id].doNodeSelection()
	}
	
	loadLib (container, svg, data){
		
		svg.append("rect")
		  .attr("x", container.canvasX)
		  .attr("y", container.canvasY)
	      .attr("width", container.libW)
	      .attr("height", container.libH)
	      .style("fill", "#E1E1E1")
	      .style("stroke", "#4682b4").style('stroke-width','1px');
		let h = 30, w = 80;
		let dy = h+5, x0 = container.canvasX+4;
		let y = container.canvasY-dy+5;	
		
		svg.append("text")
		  .text("Nodes:")
	      .attr("x", x0+3)
	      .attr("y", y+dy-8)
  
		for (let i=0; i<10; i++) {
			y+=dy;
			let n = new LibNode(container, null, null, svg, null, undefined, "Node_"+i, x0, y, w, h, {"c":"#E1E1E1"});
			n.create()
		}
	}
	
	loadNodes (loader, container, svg, data){
		this.nodeLoader[loader]( container, svg, data)
	}
	
	loadOrchestrationContainer = (container, svg, data) =>{
			this.container = container;
			let cloudeProviders = data;
			if (cloudeProviders===undefined) {
				return;
			}
			
			svg.append("rect")
			  .attr("x", 25)
			  .attr("y", 0)
		      .attr("width", 2*container.diagramW)
		      .attr("height", container.diagramH)
		      .style("fill", "#FEFEFE")
		      .style("stroke", "#FEFEFE").style('stroke-width','1px');
			
			let x0 = 0 + 30, x1 = 10, y0 = 10, y1 = 10, dx = 190, dy = 60, ddx = 5;
			let col = 0;
			container.nodeMap = {};
			container.elemNodeMap = {};
			container.linkMap = {};
			var i=0;
			for (var c in cloudeProviders) {
				let cloudeProvider = cloudeProviders[c];
				
				if (i++>0) {
					y1+=dy;
				}
				x1=x0;
				let n1 = new CPNode(container, null, data, svg, cloudeProvider, cloudeProvider.Type, cloudeProvider.Name, x1, y1, 100, 50, {"c":"#E1E1E1", "id":cloudeProvider.id});
				
				if (cloudeProvider.Instances===undefined) {
					continue;
				}
				
				n1.expandable = Object.keys(cloudeProvider.Children).length>0
				//console.log("i="+i)
				if (cloudeProvider.ExpandState===0) {
					continue;
				}
				
				var j = 0;
				for (var m in cloudeProvider.Children) {
					let instance = cloudeProvider.Children[m];

					let existing = container.nodeMap[instance.InstanceId];
					if (existing!==undefined) {
						new Link(container, svg, n1, existing, {"dx":ddx*(i+1)});
						continue;
					}
					
					col = 2;
					if (j>0) {
						y1+=dy;
					}
					x1=x0+dx;
					//console.log("i="+i+"j="+j+"k="+k+"m="+m)
					let n2 = new NodeNode(container, n1, data, svg, instance, instance.Type, instance.Name, x1, y1, 100, 50, {"c":"#E1E1E1"});
					new Link(container, svg, n1, n2, {"dx":ddx*(i+1)});
					n2.expandable = instance.Children && instance.Children.length>0
					//console.log("i="+i)
					if (instance.ExpandState===0) {
						continue;
					}
					
					if (instance.Children!==undefined) {
						var k=0;
						for (var n=0; n<instance.Children.length;n++) {
							let pod = instance.Children[n];

							let existing = container.nodeMap[pod.Name];
							if (existing!==undefined) {
								new Link(container, svg, n2, existing, {"dx":ddx*(i+1)}).create();
								continue;
							}
							
							col = 2;
							if (k>0) {
								y1+=dy;
							}
							x1=x0+2*dx;
							//console.log("i="+i+"j="+j+"k="+k+"m="+m)
							let n3 = new PodNode(container, n2, data, svg, pod, pod.Type, pod.Name, x1, y1, 100, 50, {"c":"#E1E1E1"});
							new Link(container, svg, n2, n3, {"dx":ddx*(i+1)});
							k++
						}
					}
					j++;
					
				}
			}
			console.log("keys="+Object.keys(container.nodeMap).length)
			
			for (var n in container.nodeMap) {
				container.nodeMap[n].create();
			}
			for (var n in container.linkMap) {
				container.linkMap[n].create();
			}
			
			d3.selectAll('line').on("mouseenter", ()=>{
				let ss = d3.event.target.id.split("|")
				container.linkMap[ss[0]].highlight(true)
			}).on("mouseout", ()=>{
				let ss = d3.event.target.id.split("|")
				container.linkMap[ss[0]].highlight(false)
			})
			d3.select("#orchestTooltip").classed("hidden", true);
		}
		
	loadOrchestrationContainerTest = (container, svg, data) =>{
		let clusters = data.Clusters;
		if (clusters===undefined) {
			return;
		}
		let x0 = container.libW + 30, x1 = 10, y0 = 10, y1 = 10, dx = 190, dy = 60, ddx = 5;
		let col = 0;
		container.nodeMap = {};

		for (var i=0; i<clusters.length; i++) {
			let cluster = clusters[i];
			
			if (i>0) {
				y1+=dy;
			}
			x1=x0;
			let n1 = new DiagramNode(container, null, data, svg, cluster, cluster.Type, cluster.Name, x1, y1, 100, 50, {"c":"#E1E1E1"});
			n1.expandable = cluster.Children.length>0
			//console.log("i="+i)
			if (cluster.ExpandState===0) {
				continue;
			}
			for (var j=0; j<cluster.Children.length;j++) {
				let ETCD = cluster.Children[j];
				let existing = container.nodeMap[ETCD.id];
				if (existing!==undefined) {
					new Link(container, svg, n1, existing, {"dx":ddx*(i+1)}).create();
					continue;
				}
				
				x1=x0+dx;
				if (j>0) {
					y1+=dy;
				}
				let color = ETCD.testState?"#00FF00":"#FF8080"
				let n2 = new DiagramNode(container, n1, data, svg, ETCD, ETCD.Type, ETCD.Name, x1, y1, 100, 50, {"c":color});
				container.nodeMap[ETCD.id] = n2;
				
				new Link(container, svg, n1, n2, {"dx":ddx*(i+1)}).create();
				
				n2.expandable = ETCD.Children.length>0
				//console.log("i="+i+"j="+j)
				if (ETCD.ExpandState===0) {
					continue;
				}
				
				for (var k=0; k<ETCD.Children.length;k++) {
					let master = ETCD.Children[k];
					
					let existing = container.nodeMap[master.id];
					if (existing!==undefined) {
						new Link(container, svg, n2, existing, {"dx":ddx*(j+1)}).create();
						continue;
					}
					
					x1=x0+2*dx;
					if (k>0) {
						y1+=dy;
					}
					let n3 = new DiagramNode(container, n2, data, svg, master, master.Type, master.Name, x1, y1, 100, 50, {"c":"#E1E1E1"});
					container.nodeMap[master.id] = n3;
					
					new Link(container, svg, n2, n3, {"dx":ddx*(j+1)}).create();
					
					n3.expandable = master.Children.length>0
					//console.log("i="+i+"j="+j+"k="+k)
					if (master.ExpandState===0) {
						continue;
					}
					//console.log("master=" + Object.keys(container.nodeMap).length)
					for (var m=0; m<master.Children.length; m++) {
						let node = master.Children[m];
						
						let existing = container.nodeMap[node.id];
						if (existing!==undefined) {
							new Link(container, svg, n3, existing, {"dx":ddx*(k+1)}).create();
							continue;
						}
						
						col = 2;
						if (m>0) {
							y1+=dy;
						}
						x1=x0+3*dx;
						//console.log("i="+i+"j="+j+"k="+k+"m="+m)
						let n4 = new DiagramNode(container, n3, data, svg, node, node.Type, node.Name, x1, y1, 100, 50, {"c":"#E1E1E1"});
						container.nodeMap[node.id] = n4;
						new Link(container, svg, n3, n4, {"dx":ddx*(k+1)}).create();
						
					}
				}
			}
		}
		for (let n in container.nodeMap) {
			container.nodeMap[n].create();
		}
		console.log("keys="+Object.keys(container.nodeMap).length)
		d3.selectAll('line').on("mouseenter", ()=>{
			let ss = d3.event.target.id.split("|")
			container.linkMap[ss[0]].highlight(true)
		}).on("mouseout", ()=>{
			let ss = d3.event.target.id.split("|")
			container.linkMap[ss[0]].highlight(false)
		})
	}
}

const findContainer = function(node, type) {
	var x1 = node.x1;
	var y1 = node.y1// + ReactDOM.findDOMNode(node.container.state.gg).scrollTop();
	var x2 = node.x2;
	var y2 = node.y2

	
	let map = node.container.nodeMap;
	for ( var c in map) {
		var cc = map[c];
		if (cc == node) {
			continue;
		}
		
		if (type!==undefined && type != cc.nType) {
			continue;
		}
		
		if (cc.contains && cc.contains(x1, y1, x2, y2, cc.nType)) {
			return cc;
		}
	}
	return undefined;
}

const drag = d3.drag().on(
		"drag",
		function(d) {
			let node = d.node

			if (node.isLib) {
				d.x = d3.event.x
				node.x1 = d.x;
			}
			d.y = d3.event.y
			node.y1 = d.y;
			
			//node.create();
//console.log("dx=" + d3.event.dx + " dy=" + d3.event.dy)			
//console.log("x=" + d.x + " y=" + d.y)
//console.log("map.length=" + Object.keys(node.container.nodeMap).length)
			node.rectElement.attr("x", d.x).attr("y", d.y)
			node.textElement.attr("x", d.x+node.dx).attr("y", d.y+node.dy)


			if (node.isLib) {
				var c = findContainer(node, node.targetType);
				if (c) {
					d.node.rectElement.style("cursor", "pointer");
					d.node.textElement.style("cursor", "pointer");
				} else {
					d.node.rectElement.style("cursor", "no-drop");
					d.node.textElement.style("cursor", "no-drop");
					d.node.container.state.diagram.style("cursor", "no-drop")
				}
			}
		}).on("start", function(d) {
			if (d.node.isLib && d.node.cursor == "move") {
				d.node.clone();
			}
}).on("end", function(d) {

	var c = findContainer(d.node, d.node.targetType);
	d.node.container.state.diagram.style("cursor", "default")
	if (c) {
		if (d.node.dragEndHandler) {
			d.node.dragEndHandler(c);
		}
	}
	
	d.node.rectElement.style("cursor", d.node.cursor)
	if (d.node.isLib) {
		d.node.remove();
		//$scope.self.publish("/serviceService/loadGlobalService/done");
	}
/*
	var c = huawei.findContainer(huawei.nodeMap, d.node, d.node.targetType);
	if (c == undefined) {
		return;
	}
	var res = {};
	res.service_id = d.node.id;
	res.instance_tmpl_id = c.id

	if (d.node.dragToHandler) {
		d.node.dragToHandler($scope, c, d);
	}*/
});

const contextMenu = function(that, newContext) {
    if (context) {
        if (context !== newContext) {
          console.log('contextmenu: cannot execute for context: ' + newContext + ' while in current context: ' + context);
          return;
        }
      }
      context = newContext;
      //console.log('contextmenu:' + context);
      d3.event.preventDefault();

      var position = d3.mouse(that);
      d3.select('#context-menu')
              .style('position', 'absolute')
              .style('left', position[0] + "px")
              .style('top', position[1] + "px")
              .style('display', 'inline-block')
              .on('mouseleave', function() {
        d3.select('#context-menu').style('display', 'none');
        context = null;
      });
      d3.select('#context-menu').attr('class', 'menu ' + context);
    }

let nm = new NodeManager()
export default nm; 