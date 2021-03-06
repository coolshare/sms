import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cm from '../../../common/CommunicationManager'
import OrchestrationBranchDetail from './OrchestrationBranchDetail'
import OrchestrationEnterpriseDetail from './OrchestrationEnterpriseDetail'
import OrchestrationHeader from './OrchestrationHeader'
import OrchestrationFloatMenu from './OrchestrationFloatMenu'
import Enterprise from '../../../common/models/Enterprise'
import Branch from '../../../common/models/Branch'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import {InternetNode, HostNode, PodNode} from './DiagramElements'
import Provider from '../../../common/models/Provider'


const stateColors = ["green", "yellow", "orange", "pink", "red"]

class _ProviderDiagram extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			detailX:3000
		}
		this.canvasX = 10;
		this.canvasY = 15;
		this.diagramW = 1800;
		this.diagramH = 5000;
		this.nodeMap = {}
		this.elemNodeMap = {}
		this.contextMenuShowing = false;
		this.dragHandler = null;
		this.idCount = 110;
		this.linkMap = {};
		this.Orchestration2Data = null;
		this.initZoom = .5;
		this.zoomFactor = this.initZoom
		this.collectNodes = {"Container":this.handleProvider, "Enterprise":this.handleEnterprise};
		this.enterpriseX = 0;
		this.enterpriseY = 0;
		this.provider = this.props.provider===null?new Provider():this.props.provider;
		this.noDrag = false;
		this.innerColor = "#E1E1E1";
		cm.selInnerColor = "#1133E4";
		this.detailsW = 260;
		this.detailShowState = false;
		
	}
	componentDidMount() {
		let self = this;
		
		
		this.user = cm.getStoreValue("HeaderReducer", "user");
		
		cm.dispatch({"type":"updateMainContainerSize", "data":{"w":this.refs.orchestrationMain.clientWidth, "h":this.refs.orchestrationMain.clientHeight}})
		cm.subscribe(["refreshProviderDiagram"], (action)=>{
			if (cm.getStoreValue("HeaderReducer", "currentLink")!=="ProviderDiagram") {
				return;
			}
		
			this.animateDetails(false, true)
			cm.provider = cm.getStoreValue("OrchestrationReducer","provider")
			var filter = cm.getStoreValue("OrchestrationReducer", "search");
			filter = filter.trim()===""?undefined:filter.toLowerCase();
			console.log("role="+cm.role)
			var tab = cm.selectedTab;
			if (tab==="Provider") {
				if (cm.provider.dirty) {
					self.loadProvider(()=>{
						self.buildProviderDiagram(filter, true)
					});
				} else {
					self.buildProviderDiagram(filter, true)
				}
				
				
			} else if (tab==="Enterprise") {
				cm.setPath(cm.routeData["EnterpriseDiagram"]);
				cm.dispatch([{"type":"refreshEnterpriseDiagram"}]);
			/*
				if (cm.selectedEnterpriseId!==undefined) {
					var selectedEnterprise = cm.provider.enterpriseMap[cm.selectedEnterpriseId];
					if (selectedEnterprise.dirty) {
						self.loadEnterpriseBranch(()=>{
							selectedEnterprise.dirty = false;
							self.buildEnterpriseDiagram(undefined, filter, true)
						})
					} else {
						self.buildEnterpriseDiagram(undefined, filter, true)
					}
				
					
				}*/				
			}	
		})
		
		cm.subscribe("setSelectedEnterpriseId", (action)=>{
		
			var selectedEnterpriseId = cm.getStoreValue("OrchestrationReducer", "selectedEnterpriseId");

			if (!cm.getStoreValue("OrchestrationReducer", "noDetails")) {
				this.animateDetails(true)
			}
			//this.loadEnterpriseBranch(()=>{
			//	self.buildEnterpriseDiagram(undefined, undefined, true)
			//})
			if (cm.selectedEnterpriseId===undefined) {
				this.animateDetails(false)
			}
			
		});
		
		
		cm.subscribe("hideNodeDetails", (action)=>{
			this.animateDetails(false)
		});
		
		if (!this.props.isProviderInit) {
			cm.dispatch([{"type":"setSelectedTab", "data":this.user.role}, {"type":"setIsInit"}, {"type":"refreshProviderDiagram"}])
		} else {
			cm.dispatch([{"type":"setSelectedTab", "data":this.props.selectedTab}, {"type":"refreshProviderDiagram"}])
		}
		
	}
	
	loadProvider = (callback) => {
		var self = this;
	
		cm.dispatch({"type":"/EnterpriseService/getAll", "options":{"response":(data)=>{
			cm.provider.nodes = [];
			cm.provider.enterpriseMap = {}
			cm.provider.linkMap = {}
			if (cm.provider.internetForProvider===undefined) {
	  			cm.provider.internetForProvider = new Enterprise({"EnterpriseId":new Date().valueOf()+Math.floor(Math.random()*999), "BusinessName":"", "ContactName":"", "Phone":"", "Email":"", "AlertMethod":"", "Address":"", "Icon":"http://coolshare.com/temp/wan.png"}, 5, 50, 50 , 35, Math.floor(Math.random()*5), self.innerColor, -24, -24, 48, 48);		
	  			
	  		}
			cm.provider.nodes.push(cm.provider.internetForProvider)
  			cm.provider.enterpriseMap[cm.provider.internetForProvider.id] = cm.provider.internetForProvider;
			
			cm.provider.dirty = false;
			for (var i=0; i<data.length;i++) {
				var e = new Enterprise(data[i], 20, 100, 100, 35, Math.floor(Math.random()*5), this.innerColor, -8, -8, 16, 16)
				cm.provider.nodes.push(e);
				cm.provider.enterpriseMap[e.id] = e;
				cm.nodeMap[e.id] = e;
				cm.provider.linkMap[cm.provider.internetForProvider.id+"_"+e.id] = {"source":cm.provider.internetForProvider, "target":e};
			}

			if (callback) {
				callback();
			}
			//cm.dispatch({"type":"setProvider", "data":cm.provider})
			
			//cm.dispatch({"type":"setSelectedTab", "data":self.user.role})
		}}});
	}
	
	
	componentWillUnmount() {
		cm.unsubscribe(["refreshProviderDiagram"]);
		cm.unsubscribe("setSelectedEnterpriseId");		
		cm.unsubscribe("hideNodeDetails");
		//cm.dispatch({"type":"setProvider", "data":new Provider()})
	}
	
	animateDetails(isShow, forced) {
		if (!forced && (this.detailShowState===isShow || this.isDBClick)) {	
			return;
		}
		this.detailShowState = isShow; 
		var self = this;
		
		if (isShow) {			
			this.setState({"detailX":this.props.mainContainerSize.w +50})
			//this.refs.detailPane.style.display = "block"
		
			this.dx = -11;
			this.limit = this.props.mainContainerSize.w - this.detailsW;
		} else {
			this.dx = 11;
			//this.refs.detailPane.style.display = "none"
			this.limit = this.props.mainContainerSize.w +50;
		}
		this.doAnimateDetails(isShow)
	}
	
	doAnimateDetails(isShow) {
		var self = this;
		if (self.refs.detailPane===undefined) {
			return
		}
		if (isShow) {
			if (self.refs.detailPane.offsetLeft<this.limit) {
				return;
			}
			
		} else {
			if (self.refs.detailPane.offsetLeft>this.limit) {
				return;
			}
		}
		self.setState({"detailX":this.state.detailX+self.dx})

		setTimeout(()=>{
			self.doAnimateDetails(isShow)
		
		}, 10)
	}
	
	handleNodeDBClick(d) {
		
	console.log("dc")
		if (d.label==="") {
			return;
		}
		var self = this;
		this.noDrag = true;
		this.isDBClick = true;
		//setTimeout(()=>{
			self.setState({"detailX":self.props.mainContainerSize.w +50})
			self.detailShowState = false
		//}, 0)
		if (self.scTimer) {
			clearTimeout(self.scTimer)
		}
		if (this.dragTimer) {
			console.log("end drag")
			clearTimeout(this.dragTimer);
		}
		if (d.type==="Enterprise" && d.label.length>0) {
			cm.dispatch([{"type":"setSelectedEnterpriseId", "data":d.id, "isDBClick":self.isDBClick},
				{"type":"setSelectedTab", "data":"Enterprise"}])
			cm.setPath(cm.routeData["EnterpriseDiagram"])
				
			
		}
	}
	
	handleNodeClick(d) {
		var self = this;
	
		if (self.sclickTimer) {
			clearTimeout(self.sclickTimer)
		}
		self.sclickTimer = setTimeout(()=>{
			
			if (self.isDBClick) {
				return;
			}
			self.doNodeClick(d)		
		}, 500)
	}
	doNodeClick(d) {
		console.log("sc")
	
		if (d.label==="") {
			return;
		}
		this.noDrag = true;
		if (this.dragTimer) {
			//console.log("end drag")
			clearTimeout(this.dragTimer);
		}
		self.scTimer = setTimeout(()=>{
			if (d.type==="Enterprise") {
				cm.dispatch({"type":"setSelectedEnterpriseId", "data":d.id})
			} else if (d.type==="Branch") {
				cm.dispatch({"type":"setSelectedBranchId", "data":d.id})
			}
		
		}, 500)
		
		
	}

	buildProviderDiagram(filter, forceReload) {

		this.drawDiagram("Provider", cm.provider.nodes, cm.provider.linkMap, filter, forceReload);
	}
	
	drawDiagram(tab, nodes, linkMap, filter, forceReload) {
		
		
		var self = this;
		if (self.svg!==undefined) {
			if (forceReload) {
				d3.selectAll("svg").remove();
				self.svg=undefined
			} else {
				return
			}
		
			
		}
		if (nodes.length===0) {
			return;
		}
		var dx = 150, dy = 150;	
		
		var rings = [[15, 100, 0, 0],[20, 180, -70, -80],[30, 240, -40, -40],[40, 280, -80, -80],[50, 340, -110, -110]]
		var j = 0;

		
		var radius = rings[j][1];
		var width = (radius * 2) + 50;
        var height = (radius * 2) + 50;
        var x0 = nodes[0].xx = width/2+dx;
		var y0 = nodes[0].yy = height/2+dy;
		self.filteredMap = {};
		for (var i=1, k=0; i<nodes.length; i++, k++) {
			var n = nodes[i];
			
			if (filter!==undefined) {
				  if (n.label.toLowerCase().indexOf(filter)<0 && n.label!=="") {						  
					  self.filteredMap[n.id] = n;
					  continue;
				  }
			}
			
			n.angle = (k / (Math.min(rings[j][0], nodes.length)/2)) * Math.PI; // Calculate the angle at which the element will be placed.
                                                // For a semicircle, we would use (i / numNodes) * Math.PI.
			var x = (radius * Math.cos(n.angle)) + (width/2) + rings[j][2]; // Calculate the x position of the element.
			var y = (radius * Math.sin(n.angle)) + (height/2)+ rings[j][3]; // Calculate the y position of the element.
			n.xx = x+dx;
			n.yy = y+dy;
			if (k>rings[j][0]) {
				k = 0
				j++;
				radius = rings[j][1];
				width = (radius * 2) + 50;
		        height = (radius * 2) + 50;
			}
		}

		var width = 1200, height = 1200;
		self.svg = d3.select("#svg").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		    .on("mousemove", function() {
		    	  if (self.dragLine!==undefined) {
		    		  var e = d3.event;
		    		  
		    		  self.dragLine.attr("x1",self.dragX)
		                 .attr("y1",self.dragY)
		                 .attr("x2",e.clientX)
		                 .attr("y2",e.clientY-110);
		    		  //console.log("x="+e.clientX+" y="+e.clientY)
		    		  //self.dragLine.attr("transform", "translate(" + e.clientX + "," + e.clientY + ")")
		    	  }
		      })
		      .on("mouseup", (d)=>{
					self.handleMouseUp(d);
	
					if (cm.selectedTab==="Provider") {
						cm.dispatch({"type":"setSelectedEnterpriseId", "data":undefined})
					} else if (cm.selectedTab==="Enterprise") {
						cm.dispatch({"type":"setSelectedBranchId", "data":undefined})
					}
					
					self.animateDetails(false)
					self.involveNode = false;
				})
			  .on("click", (d)=>{
				  if (cm.overLink) {
					  cm.dispatch({"type":"setSelectedLink", "data":cm.overLink})		
				  }
			  })
			  
			  
			  
		self.update(tab, nodes, linkMap, filter);
	}
	
	

	update(tab, nodes, linkMap, filter) {
		  var self = this;
		  
		  var filteredMap = {};
		  for (var i in linkMap) {
			  var link = linkMap[i]
			  if (self.filteredMap[link.source.id]!==undefined || self.filteredMap[link.target.id]!==undefined) {
				  continue;
			  }
			  var g = link.g = self.svg.append("g").attr("class", "link")
			  link.line = g.append("line").data([link]).attr("x1", link.source.xx).attr("y1", link.source.yy).attr("x2",
						link.target.xx).attr("y2", link.target.yy).attr("stroke", ((me)=>{
							return (d) => {						
								return cm.selectedLink===me?"#00F":"#D1D1D1"
							}		
						})(link))
						
			  if (tab==="Enterprise" && link.source.label!=="") {
				  link.line.style("cursor", "pointer")			 
				  	.on("click", ((me)=>{
						return (d) => {													
							cm.dispatch({"type":"setSelectedLink", "data":me})
							d3.event.stopPropagation();
						}		
					})(link))
					.on("mouseover", ((me)=>{
						return (d) => {													
							me.line.attr("stroke-width", "4px")	
							cm.overLink = me
						}		
					})(link))
					.on("mouseout", ((me)=>{
						return (d) => {	
							setTimeout(()=>{
								
								if (cm.overLink==me) {
									cm.overLink = undefined;
								}
								me.line.attr("stroke-width", "1px")	
							}, 1000)						
											
						}		
					})(link))
			  }		
		  }
		  
		  for (var i=0; i<nodes.length; i++) {
			  var node = nodes[i];
			  if (self.filteredMap[node.id]!==undefined) {
				  continue;
			  }
			  var g = node.g = self.svg.append("g").attr("class", "node").attr("width", 2*node.r).attr("height", 2*node.r)
			  .attr("transform", "translate(" + node.xx + "," + node.yy + ")")
			  
			  node.c1 = g.append("circle")
			  	.data([node])
				.attr("r", function(d){return d.r;})
				
				.style("stroke-width", 1)    // set the stroke width
				.style("stroke", "black")  
				.style("cursor", "pointer")  
				.style("fill", function(d) {return stateColors[d.state]})
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp()
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				});
	
			  node.c2 = g.append("circle")
			    .data([node])
				.attr("r", function(d){return d.r-5;})
				.style("fill", function(d) {
					var selectedTab = cm.getStoreValue("OrchestrationReducer", "selectedTab")
					if (self.props.selectedBranchId==d.id  && selectedTab==="Enterprise"|| self.props.selectedEnterpriseId==d.id && selectedTab==="Provider") {								
						return cm.selInnerColor
					} else {
						return d.innerColor;
					}
					
				})  
				.style("cursor", "pointer")
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp()
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				});
	
			  node.image = g.append("svg:image").data([node]).attr("xlink:href", function(d) {
	
					return d.icon;
					} )
				.attr("x", function(d) {return d.iconX})
				.attr("y", function(d) {return d.iconY}).attr("width", function(d) {return d.iconW}).attr("height",  function(d) {return d.iconH})  
				.style("cursor", "pointer")
				.on("click", (d)=>{
					self.involveNode = true;
					self.handleNodeClick(d)
				})
				.on("dblclick", (d)=>{
					self.involveNode = true;
					self.handleNodeDBClick(d)
				})
				.on("mousedown", (d)=>{
					self.involveNode = true;
					self.handleMouseDown(d)
				})
				.on("mouseup", (d)=>{
					self.involveNode = true;
					self.handleMouseUp()
				})
				.on("mouseover", (d)=>{
					self.involveNode = true;
					self.handleMouseOver(d);
				});	
			  node.text = g.append("text").data([node]).text(function(d) {
				  
				  //return d.angle
				  return d.label.length<22?d.label:d.label.substring(0, 21)+"...";
				} )
				.style("font-size", function(d) { return "12px"; })
			    .attr("dx", "-1.55em").attr("dy", function(d){return d.fontDy});
			    
			  /*if (filter===undefined) {
				  nodes.push(n)
			  } else {
				  if (n.label.toLowerCase().indexOf(filter)<0 && n.label!=="") {						  
					  filteredMap[n.id] = n;
					  continue;
				  }
				  nodes.push(n)
			  }*/
			  
		  } 
	}
	
	handleMouseOver(d) {
		if (this.dragLine!==undefined) {
			this.dndTar = d;
		}
	}
	handleMouseDown = (d) => {
		d3.event.preventDefault();
		if (this.props.selectedTab!=="Enterprise") {
			return;
		}
		var self = this;
		d3.event.preventDefault();
		this.noDrag = false;
		this.dragTimer = setTimeout(()=> {
			//console.log("start drag")
			self.startDrag(d)
		}, 400)
	}
	
	handleMouseUp = (d) => {
		
		d3.event.stopPropagation();
		d3.event.preventDefault();
	
		if (this.props.selectedTab!=="Enterprise") {
			return;
		}
	
		var self = this;
		this.noDrag = true;
		if (self.dragTimer) {
			//console.log("end drag")
			clearTimeout(self.dragTimer);
		}

		
		
		if (this.dragLine!==undefined) {
			if (this.props.selectedTab==="Provider") {
				
				
			} else if (this.props.selectedTab==="Enterprise") {
				this.addBranchLink();
			}
		}
		
		
		d3.select("#dragLine").remove();
		self.dragLine = undefined;

	}
	
	addEnterpriseLink = () => {	
		//this.simulation.stop();
		
		cm.dispatch({"type":"addEnterpriseLink", "data":{"source":this.dndSrc.id, "target":this.dndTar.id, "tab":this.props.selectedTab}})
		var provider = this.props.provider;
		var src = provider.enterpriseMap[this.dndSrc.id];
  		var tar = provider.enterpriseMap[this.dndTar.id];
  		
  		provider.linkMap[src.id+"_"+tar.id] = {"source":src, "target":tar}
  		//this.simulation.restart();
	}
	
	
	startDrag = (d) => {
		if (this.noDrag) {
			return;
		}
		this.dragX = d.xx-d.r/4;
		this.dragY = d.yy-d.r/4
		
		this.dragLine = this.svg.append("line").attr("x1", this.dragX).attr("y1", this.dragY).attr("x2", this.dragX).attr("y2", this.dragY)
			.attr("stroke", "#000").attr("id", "dragLine")
		this.dndSrc = d;
		//console.log("this.dragLine="+this.dragLine)
	}  
	render() {
		
		var self = this;
		//console.log("X="+self.state.detailX)
		
	    return (
	    	<div style={{"minHeight":this.props.mainContainerSize.h+"px"}} ref="orchestrationMain">
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
	    		<div style={{"width":"100vw"}}>
		    		<OrchestrationHeader/>
		    		<div id="svg"/>
			    	
				</div>
				<div ref="detailPane" style={{"position":"absolute","left":self.state.detailX, "top":"130px", "width":self.detailsW+"px", "height":this.props.mainContainerSize.h+"px", "border": "1px solid black"}}>
					{this.props.selectedTab==="Provider"?<OrchestrationEnterpriseDetail selectedEnterpriseId={self.props.selectedEnterpriseId}  title="Enterprise Info"/>:
					this.props.selectedTab==="Enterprise"?		
					<OrchestrationBranchDetail selectedBranchId={self.props.selectedBranchId} title="Branch Info"/>:null}
				</div>
				<OrchestrationFloatMenu/>	
			</div>
	    )
	}
}
const ProviderDiagram = connect(
		  store => {
			    return {
			    	
			    	isProviderInit: store.OrchestrationReducer.isProviderInit,
			    	search: store.OrchestrationReducer.search,
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedEnterpriseId: store.OrchestrationReducer.selectedEnterpriseId,
			    	selectedBranchId: store.OrchestrationReducer.selectedBranchId,
			    	provider: store.OrchestrationReducer.provider,
			    	mainContainerSize: store.MainContainerReducer.mainContainerSize
			    };
			  }
			)(_ProviderDiagram);
export default ProviderDiagram
