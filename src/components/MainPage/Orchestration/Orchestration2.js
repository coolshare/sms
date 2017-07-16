import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cm from '../../../common/CommunicationManager'
import OrchestrationNetUserDetail from './OrchestrationDetail'
import OrchestrationNetUserHeader from './OrchestrationHeader'
import OrchestrationFloatMenu from './OrchestrationFloatMenu'
import Enterprise from '../../../common/models/Enterprise'
import Branch from '../../../common/models/Branch'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import {InternetNode, HostNode, PodNode} from './DiagramElements'
import Header from '../../../components/Header/Header'
import Provider from '../../../common/models/Provider'

const stateColors = ["green", "yellow", "orange", "pink", "red"]

class _OrchestrationNetUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:null
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
		this.OrchestrationNetUserData = null;
		this.initZoom = .5;
		this.isInit = false;
		this.zoomFactor = this.initZoom
		this.collectNodes = {"Container":this.handleProvider, "Enterprise":this.handleEnterprise};
		this.enterpriseX = 0;
		this.enterpriseY = 0;
		this.provider = new Provider();
		this.noDrag = false;
	}
	componentDidMount() {
		let self = this;
		cm.subscribe(["setSelectedTab", "addEnterprise", "addBranch", "setProvider"], (action)=>{
			var tab = cm.getStoreValue("OrchestrationReducer", "selectedTab");
			var data = cm.getStoreValue("OrchestrationReducer","provider")
			if (tab==="Provider") {
				self.buildProviderDiagram()
			} else if (tab==="Enterprise") {
				if (self.props.selectedEnterprise!==null) {
					self.buildEnterpriseDiagram()
				}				
			}
		})
		var internetNode = {"BusinessName":"", "ContactName":"", "Phone":"", "Email":"", "AlertMethod":"", "Address":"", "Icon":"http://coolshare.com/temp/internet.png"}
		if (this.props.provider===null) {
			var dummyEnterprises = [{"BusinessName":"Welmart", "ContactName":"Jackson Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"123 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"Target", "ContactName":"Mark Wang", "Phone":"408-111-4444", "Email":"mwang@aaa.com", "AlertMethod":"email", "Address":"222 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"BurgerKing", "ContactName":"BurgerKing Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"phone", "Address":"555 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"Frys", "ContactName":"Frys Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"166623 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"BestBuy", "ContactName":"BestBuy Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"17723 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"}];
			

			for (var i=0; i<dummyEnterprises.length; i++) {
				dummyEnterprises[i].id = new Date().valueOf()+i
			}
			
			internetNode.id = new Date().valueOf()+9999;
			var internetForProvider = new Enterprise( internetNode, 5, 50, 50 , 35, 0, "#E1E1E1", -24, -24, 48, 48);
			this.provider.nodes.push(internetForProvider)
			this.provider.enterpriseMap[internetForProvider.id] = internetForProvider;
			for (var i=0; i<dummyEnterprises.length; i++) {
				var enterprise = new Enterprise( dummyEnterprises[i], 20, 100+60*i, 100 , 35, 0, "#E1E1E1", -8, -8, 16, 16);
				this.provider.nodes.push(enterprise);
				this.provider.enterpriseMap[enterprise.id] = enterprise;
			}
			
			
			cm.dispatch({"type":"setCounter", "data":[i, cm.getStoreValue("OrchestrationReducer", "counter")[1]]})
			
			
			
			
			for (var e in this.provider.enterpriseMap) {
				var enterprise = this.provider.enterpriseMap[e];
				if (internetForProvider.id===enterprise.id) {
					continue;
				}
				this.provider.links.push({"source":internetForProvider, "target":enterprise});

				internetNode.id = new Date().valueOf()+9999;
				var internetForEnterprise = new Enterprise( internetNode, 5, 50, 50 , 35, 0, "#E1E1E1", -24, -24, 48, 48);
				
				enterprise.nodes.push(internetForEnterprise)
				
				//var n = this.provider.nodes[i];
				
				//var list = enterprise.nodes;
				var max = 3;//+Math.floor(Math.random()*5);
				for (var j=0; j<max; j++) {
					var data2 = {"BranchName":enterprise.data.BusinessName+"Branch"+j, "ContactName":"Jackson Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"123 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/gcp.png"};
					var branch = new Branch(data2, 20, 100, 100+60*j, 35, 0, "#E1E1E1", -8, -8, 16, 16);
					enterprise.nodes.push(branch);
					
					enterprise.branchMap[branch.id] = branch;
					enterprise.links.push({"source":internetForEnterprise, "target":branch});
				}
				
			}
			cm.dispatch({"type":"setCounter", "data":[cm.getStoreValue("OrchestrationReducer", "counter")[0], j]})
			//for (var i=1; i<data.nodes.length; i++) {
			//	data["Enterprise"].links.push({ source: data["Enterprise"].nodes[0], target:data.nodes[i] });
			//}
		
			cm.dispatch({"type":"setProvider", "data":this.provider})
			this.buildProviderDiagram()
		} 
		
		
	}
	
	handleNodeClick(d) {	
		this.noDrag = true;
		if (this.dragTimer) {
			console.log("end drag")
			clearTimeout(this.dragTimer);
		}
		if (d.type==="Enterprise" && d.label.length>0) {
			cm.dispatch({"type":"setSelectedEnterprise", "data":d.id})
			cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})
			
			
		}
	}

	
	buildEnterpriseDiagram(id) {
		id = id||this.props.selectedEnterprise;
		var enterprise = this.provider.enterpriseMap[id] 
		this.drawDiagram(enterprise.nodes, enterprise.links);
	}
	
	buildProviderDiagram() {
		this.drawDiagram(this.provider.nodes, this.provider.links);
	}
	
	drawDiagram(nodes, links) {
		var self = this;
		
		if (this.state.diagram===undefined) {
			  this.state.gg = document.getElementById('svg');
			  if (this.state.gg==undefined) {
				  return 
			  }
			  this.state.gg.id = "gg";
			  this.state.gg.style.overflowY = "auto"
			  this.state.gg.style.height = Utils.screenH+"px"

			  this.state.diagram = d3.select(this.state.gg).append("svg")
			  .attr("width", this.diagramW+"px")
		      .attr("height", this.diagramH+"px").attr("x", this.canvasX).attr("y", this.canvasY)
		      .attr("transform", "translate(" + 0 + "," + 0 + ")")
		      .on("mousemove", function() {
		    	  if (self.dragLine!==undefined) {
		    		  var e = d3.event;
		    		  
		    		  self.dragLine.attr("x1",self.dragX)
		                 .attr("y1",self.dragY)
		                 .attr("x2",e.clientX)
		                 .attr("y2",e.clientY-100);
		    		  //console.log("x="+e.clientX+" y="+e.clientY)
		    		  //self.dragLine.attr("transform", "translate(" + e.clientX + "," + e.clientY + ")")
		    	  }
		      })
		      .on("mouseup", (d)=>{
					self.handleMouseUp(d);
				})
		} else {
			this.state.diagram.selectAll("*").remove();
		 }     
		      
			  
		//var nodes = data.nodes
		//var links = data.links;
		var collide = [60, 300, 50];
		if (links.length===0) {
			collide = [10, 200, 20];
		}

		self.simulation = d3.forceSimulation()
		  .force("link", d3.forceLink().id(function(d) {
		    return d.id;
		  }).distance(collide[2]))
		  .force("collide", d3.forceCollide(collide[0]))
		  .force("charge", d3.forceManyBody())
		  .force("center", d3.forceCenter(collide[1], collide[1]));

		var link = this.state.diagram.selectAll(".link")
		  .data(links, function(d) {
		    return d.target.id;
		  })

		link = link.enter()
		  .append("line")
		  .attr("class", "link");

		var node = this.state.diagram.selectAll(".node")
		  .data(nodes, function(d) {
		    return d.id;
		  })

		node = node.enter()
		  .append("g")
		  .attr("class", "node")
		  /*.call(d3.drag()
		    .on("start", dragstarted)
		    .on("drag", dragged)
		    .on("end", dragended));*/
		node.append("circle")
		.attr("r", function(d){return d.r;})
		.style("stroke-width", 1)    // set the stroke width
		.style("stroke", "black")  
		.style("cursor", "pointer")  
		.style("fill", function(d) {return stateColors[d.state]})
		.on("click", (d)=>{
			self.handleNodeClick(d)
		})
		.on("mousedown", (d)=>{
			
			self.handleMouseDown(d)
		})
		.on("mouseup", (d)=>{
			self.handleMouseUp()
		})
		.on("mouseover", (d)=>{
			self.handleMouseOver(d);
		});
		
		node.append("circle")
		.attr("r", function(d){return d.r-5;})
		.style("fill", function(d) {return d.innerColor})  
		.style("cursor", "pointer")
		.on("click", (d)=>{
			self.handleNodeClick(d)
		})
		.on("mousedown", (d)=>{
			self.handleMouseDown(d)
		})
		.on("mouseup", (d)=>{
			self.handleMouseUp()
		})
		.on("mouseover", (d)=>{
			self.handleMouseOver(d);
		});
		/*.on('contextmenu', function(d) {
	    		d.createMenu();
	    	}
		);*/
		
		node.append("svg:image").attr("xlink:href", function(d) {

		return d.icon;
		} ).attr("x", function(d) {return d.iconX})
			.attr("y", function(d) {return d.iconY}).attr("width", function(d) {return d.iconW}).attr("height",  function(d) {return d.iconH})  
			.style("cursor", "pointer")
			.on("click", (d)=>{
				self.handleNodeClick(d)
			})
			.on("mousedown", (d)=>{
				self.handleMouseDown(d)
			})
			.on("mouseup", (d)=>{
				self.handleMouseUp()
			})
			.on("mouseover", (d)=>{
				self.handleMouseOver(d);
			});	
		node.append("text").text(function(d) {
			return d.label.length<22?d.label:d.label.substring(0, 21)+"...";
			} )
			.style("font-size", function(d) { return "12px"; })
      .attr("dx", "-1.55em").attr("dy", function(d){return d.fontDy});
		/*.on("mouseover", function(d) {

  		  if (!d.showTips) {
  			  d3.event.stopPropagation();
  			  return;
  		  }

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
		*/
		self.simulation
		  .nodes(nodes)
		  .on("tick", ticked);

		self.simulation.force("link")
		  .links(links);


		function ticked() {
			
		  link
		    .attr("x1", function(d) {
		      return d.source.x;
		    })
		    .attr("y1", function(d) {
		      return d.source.y;
		    })
		    .attr("x2", function(d) {
		      return d.target.x;
		    })
		    .attr("y2", function(d) {
		      return d.target.y;
		    });

		  
		  	if (links.length===0) {
		  		node.attr("transform", function(d) {
				      return "translate(" + d.xx + ", " + d.yy + ")";
				    })
		  	} else {
		  		node.attr("transform", function(d) {
				      return "translate(" + d.x + ", " + d.y + ")";
				    })
		  	}
		    
		}

		
		function dragstarted(d) {
		  if (!d3.event.active) self.simulation.alphaTarget(0.5).restart()
			
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) self.simulation.alphaTarget(0);
		  d.fx = undefined;
		  d.fy = undefined;
		}
	
	}
	handleMouseOver(d) {
		if (this.dragLine!==undefined) {
			this.dndTar = d;
		}
	}
	handleMouseDown = (d) => {
		var self = this;
		d3.event.preventDefault();
		this.noDrag = false;
		this.dragTimer = setTimeout(()=> {
			console.log("start drag")
			self.startDrag(d)
		}, 400)
	}
	
	handleMouseUp = (d) => {
		var self = this;
		this.noDrag = true;
		if (self.dragTimer) {
			console.log("end drag")
			clearTimeout(self.dragTimer);
		}

		
		
		if (this.dragLine!==undefined) {
			if (this.props.selectedTab==="Provider") {
				this.addEnterpriseLink();
				
			} else if (this.props.selectedTab==="Provider") {
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
  		
  		provider.links.push({"source":src, "target":tar})
  		//this.simulation.restart();
	}
	addBranchLink = () => {		
		cm.dispatch({"type":"addBranchLink", "data":{"source":this.dndSrc.id, "target":this.dndTar.id, "tab":this.props.selectedTab}})
	}
	
	startDrag = (d) => {
		if (this.noDrag) {
			return;
		}
		this.dragX = d.x;
		this.dragY = d.y
		
		this.dragLine = this.state.diagram.append("line").attr("x1", d.x).attr("y1", d.y).attr("x2", d.x).attr("y2", d.y)
			.attr("stroke", "#000").attr("id", "dragLine")
		this.dndSrc = d;
		//console.log("this.dragLine="+this.dragLine)
	}  
	render() {
	    return (
	    	<div>
	    		<Header/>
		    	<div style={{"minHeight":Utils.screenH+"px"}}>
		    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    		<div style={{"float":"left"}}>
			    		<OrchestrationNetUserHeader/>
				    	<div id="svg" style={{"height":Utils.screenH+"px", "width":"100vw"}}>
				      		
						</div>
					</div>
					<div style={{"float":"left","width":"25vw", "height":Utils.screenH+"px", "border": "1px solid black"}}>
						<OrchestrationNetUserDetail selectedNode={this.props.selectedNode}/>
					</div>
					<OrchestrationFloatMenu/>	
				</div>
			</div>
	    )
	}
}
const OrchestrationNetUser = connect(
		  store => {
			    return {
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedEnterprise: store.OrchestrationReducer.selectedEnterprise,
			    	provider: store.OrchestrationReducer.provider
			    };
			  }
			)(_OrchestrationNetUser);
export default OrchestrationNetUser
