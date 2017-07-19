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
import Header from '../../../components/Header/Header'
import Provider from '../../../common/models/Provider'


const stateColors = ["green", "yellow", "orange", "pink", "red"]

class _Orchestration3 extends React.Component {
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
		this.isInit = false;
		this.zoomFactor = this.initZoom
		this.collectNodes = {"Container":this.handleProvider, "Enterprise":this.handleEnterprise};
		this.enterpriseX = 0;
		this.enterpriseY = 0;
		this.provider = this.props.provider===null?new Provider():this.props.provider;
		this.noDrag = false;
		this.innerColor = "#E1E1E1";
		this.selInnerColor = "#1133E4";
		this.detailsW = 260;
		this.detailShowState = false;
	}
	componentDidMount() {
		let self = this;
		cm.dispatch({"type":"updateMainContainerSize", "data":{"w":this.refs.orchestrationMain.clientWidth, "h":this.refs.orchestrationMain.clientHeight}})
		cm.subscribe(["setSelectedTab", "addEnterprise", "addBranch", "setProvider", "addEnterpriseLink", "addBranchLink", "setSearch", "switchTopLink",/* "setSelectedEnterprise", "setSelectedBranch", */"removeEnterprise", "removeBranch"], (action)=>{
			if (cm.getStoreValue("HeaderReducer", "currentLink")!=="Orchestration") {
				return;
			}
		
			var tab = cm.getStoreValue("OrchestrationReducer", "selectedTab");
			var data = cm.getStoreValue("OrchestrationReducer","provider")
			var filter = cm.getStoreValue("OrchestrationReducer", "search");
			filter = filter.trim()===""?undefined:filter.toLowerCase();
			if (tab==="Provider") {
				self.buildProviderDiagram(filter)
			} else if (tab==="Enterprise") {
				if (self.props.selectedEnterprise!==null) {
					self.buildEnterpriseDiagram(undefined, filter)
				}				
			}
		})
		
		cm.subscribe("setSelectedEnterprise", (action)=>{
			var selectedEnterprise = cm.getStoreValue("OrchestrationReducer", "selectedEnterprise");
			for (var i in self.cMap) {
				var c = self.cMap[i];
				c[0].style.fill = self.innerColor
			}
			if (self.cMap[selectedEnterprise]!==undefined) {
				self.cMap[selectedEnterprise][0].style.fill= self.selInnerColor
			}
			this.animateDetails(true)
			
		});
		cm.subscribe("setSelectedBranch", (action)=>{
			var selectedBranch = cm.getStoreValue("OrchestrationReducer", "selectedBranch");
			for (var i in self.cMap) {
				var c = self.cMap[i];
				c[0].style.fill = self.innerColor
			}
			if (self.cMap[selectedBranch]!==undefined) {
				self.cMap[selectedBranch][0].style.fill= self.selInnerColor
			}
			this.animateDetails(true)
		});
		
		cm.subscribe("hideNodeDetails", (action)=>{
			this.animateDetails(false)
		});
		
		var internetNode = {"BusinessName":"", "ContactName":"", "Phone":"", "Email":"", "AlertMethod":"", "Address":"", "Icon":"http://coolshare.com/temp/internet.png"}
		if (this.props.provider===null) {
			var dummyEnterprises = [{"BusinessName":"Walmart", "ContactName":"Jackson Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"123 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"Target", "ContactName":"Mark Wang", "Phone":"408-111-4444", "Email":"mwang@aaa.com", "AlertMethod":"email", "Address":"222 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"BurgerKing", "ContactName":"BurgerKing Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"phone", "Address":"555 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"Frys", "ContactName":"Frys Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"166623 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
			                            {"BusinessName":"BestBuy", "ContactName":"BestBuy Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"17723 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"}];
			

			for (var i=0; i<dummyEnterprises.length; i++) {
				dummyEnterprises[i].id = new Date().valueOf()+i
			}
			
			internetNode.id = new Date().valueOf()+9999;
			this.provider.internetForProvider = new Enterprise( internetNode, 5, 50, 50 , 35, Math.floor(Math.random()*5), self.innerColor, -24, -24, 48, 48);
			this.provider.nodes.push(this.provider.internetForProvider)
			this.provider.enterpriseMap[this.provider.internetForProvider.id] = this.provider.internetForProvider;
			for (var i=0; i<dummyEnterprises.length; i++) {
				var enterprise = new Enterprise( dummyEnterprises[i], 20, 100+60*i, 100 , 35, Math.floor(Math.random()*5), self.innerColor, -8, -8, 16, 16);
				this.provider.nodes.push(enterprise);
				this.provider.enterpriseMap[enterprise.id] = enterprise;
			}
			
			
			cm.dispatch({"type":"setCounter", "data":[i, cm.getStoreValue("OrchestrationReducer", "counter")[1]]})
			
			
			
			
			for (var e in this.provider.enterpriseMap) {
				var enterprise = this.provider.enterpriseMap[e];
				if (this.provider.internetForProvider.id===enterprise.id) {
					continue;
				}
				this.provider.links.push({"source":this.provider.internetForProvider, "target":enterprise});

				internetNode.id = new Date().valueOf()+9999;
				enterprise.internetForEnterprise = new Enterprise( internetNode, 5, 50, 50 , 35, Math.floor(Math.random()*5), self.innerColor, -24, -24, 48, 48);
				
				enterprise.nodes.push(enterprise.internetForEnterprise)
				
				//var n = this.provider.nodes[i];
				
				//var list = enterprise.nodes;
				var max = 3;//+Math.floor(Math.random()*5);
				for (var j=0; j<max; j++) {
					var data2 = {"id":new Date().valueOf()+j, "BusinessName":enterprise.data.BusinessName+"Branch"+j, "ContactName":"Jackson Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"123 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/gcp.png"};
					var branch = new Branch(data2, 20, 100, 100+60*j, 35, Math.floor(Math.random()*5), self.innerColor, -8, -8, 16, 16);
					enterprise.nodes.push(branch);
					
					enterprise.branchMap[branch.id] = branch;
					enterprise.links.push({"source":enterprise.internetForEnterprise, "target":branch});
				}
				
			}
			cm.dispatch({"type":"setCounter", "data":[cm.getStoreValue("OrchestrationReducer", "counter")[0], j]})
			//for (var i=1; i<data.nodes.length; i++) {
			//	data["Enterprise"].links.push({ source: data["Enterprise"].nodes[0], target:data.nodes[i] });
			//}
		
			cm.dispatch({"type":"setProvider", "data":this.provider})
			//this.buildProviderDiagram()
		} 
		
		
	}
	
	componentWillUnmount() {
		cm.unsubscribe(["setSelectedTab", "addEnterprise", "addBranch", "setProvider", "addEnterpriseLink", "addBranchLink", "setSearch", "switchTopLink", /*"setSelectedEnterprise", "setSelectedBranch", */"removeEnterprise", "removeBranch"]);
		cm.unsubscribe("setSelectedEnterprise");		
		cm.unsubscribe("setSelectedBranch");
		cm.unsubscribe("hideNodeDetails");
	}
	
	animateDetails(isShow) {
		if (this.detailShowState===isShow || this.isDBClick) {	
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
		var self = this;
		this.noDrag = true;
		this.isDBClick = true;
		setTimeout(()=>{
			self.setState({"detailX":self.props.mainContainerSize.w +50})
			self.detailShowState = false
		}, 0)
		if (self.scTimer) {
			clearTimeout(self.scTimer)
		}
		if (this.dragTimer) {
			console.log("end drag")
			clearTimeout(this.dragTimer);
		}
		if (d.type==="Enterprise" && d.label.length>0) {
			cm.dispatch({"type":"setSelectedEnterprise", "data":d.id})
			cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})
			
			
		}
	}
	handleNodeClick(d) {	
		this.noDrag = true;
		if (this.dragTimer) {
			//console.log("end drag")
			clearTimeout(this.dragTimer);
		}
		self.scTimer = setTimeout(()=>{
			if (d.type==="Enterprise") {
				cm.dispatch({"type":"setSelectedEnterprise", "data":d.id})
			} else if (d.type==="Branch") {
				cm.dispatch({"type":"setSelectedBranch", "data":d.id})
			}
		
		}, 500)
		
		
	}
	
	buildEnterpriseDiagram(id, filter) {
		id = id||this.props.selectedEnterprise;
		var enterprise = this.provider.enterpriseMap[id] 
		this.cMap = undefined;
		this.drawDiagram(enterprise.nodes, enterprise.links, filter);
	}
	
	buildProviderDiagram(filter) {
		
		this.cMap = undefined;
		this.drawDiagram(this.provider.nodes, this.provider.links, filter);
	}
	
	drawDiagram(nodes2, links2, filter) {
		var self = this;
		setTimeout(()=>{
			if (this.isDBClick) {
				this.isDBClick = false;
			}
		
		}, 1000)

		
		
		if (self.svg!==undefined) {
			//d3.selectAll("g > *").remove()
			d3.selectAll('#svg svg').remove();
			self.gMap = undefined;
		}
		self.c = 0
		if (links2.length==0) {
			
			var radius = 100;
			var width = (radius * 2) + 50;
            var height = (radius * 2) + 50;
			
			for (var i=0; i<nodes2.length; i++) {
				var angle = (i / (nodes2.length/2)) * Math.PI; // Calculate the angle at which the element will be placed.
	                                                // For a semicircle, we would use (i / numNodes) * Math.PI.
				var x = (radius * Math.cos(angle)) + (width/2); // Calculate the x position of the element.
				var y = (radius * Math.sin(angle)) + (width/2); // Calculate the y position of the element.
				nodes2[i].xx = x;
				nodes2[i].yy = y;
			}
		}
		var nodeSvg, linkSvg, simulation, nodeEnter, linkEnter ;
		var width = 700, height = 700;
		var svg = self.svg = d3.select("#svg").append("svg")
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
					//self.setState({"detailX":self.props.mainContainerSize.w+self.detailsW});
					if (!self.involveNode) {						
						self.animateDetails(false)
					}
					self.involveNode = false;
				})

		  var collide = [60, 300, 50];
			if (links2.length===0) {
				collide = [10, 50, 20];
			}
		self.simulation = simulation = d3.forceSimulation()
		  .force("link", d3.forceLink().id(function(d) {
		    return d.id;
		  }).distance(collide[2]))
		  .force("collide", d3.forceCollide(collide[0]))
		  .force("charge", d3.forceManyBody())
		  .force("center", d3.forceCenter(collide[1], collide[1]))
		  .on("tick", ticked);
		self.simulation.stop();	
		update(nodes2, links2, filter);
		self.simulation.restart();	

		
		function update(nodes2, links2, filter) {
		  
		  var nodes = [];
		  var links = [];
		  var filteredMap = {};
		  for (var i=0; i<nodes2.length; i++) {
			  var n = nodes2[i];
			  if (filter===undefined) {
				  nodes.push(n)
			  } else {
				  if (n.label.toLowerCase().indexOf(filter)<0 && n.label!=="") {						  
					  filteredMap[n.id] = n;
					  continue;
				  }
				  nodes.push(n)
			  }
			  
		  }
		  for (var i=0; i<links2.length; i++) {
			  var link = links2[i];
			  if (filteredMap[link.source.id]!==undefined || filteredMap[link.target.id]!==undefined) {
				  continue;
			  }
			  links.push(link)
		  }
		  self.simulation
		    .nodes(nodes)

		  self.simulation.force("link")
		    .links(links);

		  self.linkSvg = linkSvg = self.svg.selectAll(".link")
		    .data(links) //, function(d) { return d.target.id; })

		  linkSvg.exit().remove();

		  linkSvg = linkSvg.enter()
		      .append("line")
		      .attr("class", "link");

		  self.nodeSvg = nodeSvg = self.svg.selectAll(".node")
		    .data(nodes) //, function(d) { return d.id; })

		  nodeSvg.exit().remove();

		  nodeSvg = nodeSvg.enter()
		    .append("g")
		      .attr("class", "node")
		  
		    nodeSvg.append("circle")
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
		  var color = null;
		  if (self.props.selectedTab==="Provider" && self.props.selectedEnterprise!=null ||
				  self.props.selectedTab==="Enterprise" && self.props.selectedBranch!=null) {
			  color = "#1133E4";
		  }
		  var dd = nodeSvg.append("circle")
			.attr("r", function(d){return d.r-5;})
			.style("fill", function(d) {
				return (self.props.selectedTab==="Provider" && self.props.selectedEnterprise==d.id
						|| self.props.selectedTab==="Enterprise" && self.props.selectedBranch==d.id)?
				color:d.innerColor
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
		  if (self.cMap===undefined) {
				self.cMap = {};
				for (var i=0; i<dd._groups.length;i++) {
					for (var j=0; j<dd._groups[i].length; j++) {
						var c = dd._groups[i][j];
						var data = c.__data__;
						self.cMap[data.id] = [c, data];
					}
				}
			}
		    nodeSvg.append("svg:image").attr("xlink:href", function(d) {

				return d.icon;
				} ).attr("x", function(d) {return d.iconX})
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
		    nodeSvg.append("text").text(function(d) {
					return d.label.length<22?d.label:d.label.substring(0, 21)+"...";
					} )
					.style("font-size", function(d) { return "12px"; })
		      .attr("dx", "-1.55em").attr("dy", function(d){return d.fontDy});
		}

		function ticked() {
			if (self.c>25) {
				return 
			}
			self.c++;
			
		  	linkSvg
		      .attr("x1", function(d) {
		    	  
		    	  return d.source.xxx?d.source.xxx:d.source.x; })
		      .attr("y1", function(d) { return d.source.yyy?d.source.yyy:d.source.y; })
		      .attr("x2", function(d) { return d.target.xxx?d.target.xxx:d.target.x; })
		      .attr("y2", function(d) { return d.target.yyy?d.target.yyy:d.target.y; });
		  	
		  	
		  	
		  	if (links2.length>0) {
		  		if (self.c>1) {
		  			nodeSvg
				      .attr("transform", function(d) {				      
				    	  if (self.c==20) {
				    		  d.xxx = d.x;
					  		  d.yyy = d.y;
					  		  //if (d.label=="Walmart") {
					  		//	  console.log("self.c="+self.c+" d.xxx="+d.xxx)
					  		  //}
				    	  }
				    	  if (d.xxx) {
					  		  return "translate(" + d.xxx + ", " + d.yyy + ")"; 
				    	  } else {
				    		  return "translate(" + d.x + ", " + d.y + ")"; 
				    	  }  
				    });
				      
		  		} else {
		  			nodeSvg
				      .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
		  		}
		  	
		  		
			} else {
				nodeSvg
			      .attr("transform", function(d) { return "translate(" + d.xx + ", " + d.yy + ")"; });
			}
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
  		
  		provider.links.push({"source":src, "target":tar})
  		//this.simulation.restart();
	}
	addBranchLink = () => {	
		
		cm.dispatch({"type":"saveCurrentLink", "source":this.dndSrc.id, "target":this.dndTar.id})
		cm.popup(cm.routeData["AddLink"].component, "AddLink")
		//cm.dispatch({"type":"addBranchLink", "data":{"source":this.dndSrc.id, "target":this.dndTar.id, "tab":this.props.selectedTab}})
	}
	
	startDrag = (d) => {
		if (this.noDrag) {
			return;
		}
		this.dragX = d.x+d.r;
		this.dragY = d.y+d.r
		
		this.dragLine = this.svg.append("line").attr("x1", this.dragX).attr("y1", this.dragY).attr("x2", this.dragX).attr("y2", this.dragY)
			.attr("stroke", "#000").attr("id", "dragLine")
		this.dndSrc = d;
		//console.log("this.dragLine="+this.dragLine)
	}  
	render() {
		
		var self = this;
		//console.log("X="+self.state.detailX)
	    return (
	    	<div>
	    		<Header/>
		    	<div style={{"minHeight":this.props.mainContainerSize.h+"px"}} ref="orchestrationMain">
		    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    		<div style={{"width":"100vw"}}>
			    		<OrchestrationHeader/>
			    		<div id="svg"/>
				    	
					</div>
					<div ref="detailPane" style={{"position":"absolute","left":self.state.detailX, "top":"130px", "width":self.detailsW+"px", "height":this.props.mainContainerSize.h+"px", "border": "1px solid black"}}>
						{this.props.selectedTab==="Provider"?<OrchestrationEnterpriseDetail selectedEnterprise={self.props.selectedEnterprise}  title="Enterprise Info"/>:
						this.props.selectedTab==="Enterprise"?		
						<OrchestrationBranchDetail selectedBranch={self.props.selectedBranch} title="Branch Info"/>:null}
					</div>
					<OrchestrationFloatMenu/>	
				</div>
			</div>
	    )
	}
}
const Orchestration = connect(
		  store => {
			    return {
			    	search: store.OrchestrationReducer.search,
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedEnterprise: store.OrchestrationReducer.selectedEnterprise,
			    	selectedBranch: store.OrchestrationReducer.selectedBranch,
			    	provider: store.OrchestrationReducer.provider,
			    	mainContainerSize: store.MainContainerReducer.mainContainerSize
			    };
			  }
			)(_Orchestration3);
export default Orchestration
