import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cm from '../../../common/CommunicationManager'
import OrchestrationDetail from './OrchestrationDetail'
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

class _Orchestration2 extends React.Component {
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
		this.Orchestration2Data = null;
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
			var dummyEnterprises = [{"BusinessName":"Walmart", "ContactName":"Jackson Wang", "Phone":"408-333-4444", "Email":"jwang@aaa.com", "AlertMethod":"email", "Address":"123 abc st, sunnyvale, CA 95111", "Icon":"http://coolshare.com/temp/aws.png"},
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
	
	drawDiagram(nodes2, links2) {
		var self = this;
		
		var width = 960,
	    height = 500;

		var color = d3.scaleOrdinal(d3.schemeCategory20);
	
		var nodes = [],
		    links = [];
		var collide = [60, 300, 50];
		if (links2.length===0) {
			collide = [10, 200, 20];
		}
		var simulation = d3.forceSimulation()
		    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(collide[2]))
		    .force("charge", d3.forceManyBody())
		    
		    .force("collide", d3.forceCollide(collide[0]))
		    .force("charge", d3.forceManyBody())
		    .force("center", d3.forceCenter(collide[1], collide[1]));
	
		var svg = d3.select("#svg").append("svg")
		    .attr("width", width)
		    .attr("height", height);
	
		var node = svg.selectAll(".node"),
		    link = svg.selectAll(".link");
	
		// 1. Add three nodes and three links.
		//var a = {id: "a", "label":"a"}, b = {id: "b", "label":"b"}, c = {id: "c", "label":"c"}, d = {id: "d", "label":"d"};
		//var a = nodes2[1], b = nodes2[2], c = nodes2[3], d = nodes2[4];
		setTimeout(function() {
		  for (var i=0; i<nodes2.length; i++) {
			  nodes.push(nodes2[i])
		  }
		  for (var i=0; i<links2.length; i++) {
			  links.push(links2[i])
		  }
		  //nodes.push(a, b, c, d);
		  //links.push({source: a, target: b}, {source: a, target: c}, {source: d, target: c});
		  start();
		}, 0);
		//setTimeout(function() {
		//	nodes.push(nodes2[nodes2.length-1]);
		//  start();
		//}, 3000);
		// 2. Remove node B and associated links.
		setTimeout(function() {
			links.push({source: nodes[1], target: nodes[2]});
		  start();
		}, 5000);
	
		/*// Add node B back.
		setTimeout(function() {
		  var a = nodes[0], b = {id: "b"}, c = nodes[1];
		  nodes.push(b);
		  links.push({source: a, target: b}, {source: b, target: c});
		  start();
		}, 6000);
	*/
		function start() {
		  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; })
		          .enter().append("line")
		          .merge(link)
		          .attr("class", "link");
	
		  link.exit().remove();
	
		  node = node.data(nodes, function(d) { return d.id;})
		    .enter().append("circle")
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
	
		  node.exit().remove();
	
		  simulation
		    .nodes(nodes)
		    .on("tick", tick);
	
		  simulation.force("link")
		    .links(links);
		}
	
		function tick() {
		  node.attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; })
	
		  link.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
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
			    		<OrchestrationHeader/>
			    		<div id="svg"/>
				    	
					</div>
					<div style={{"float":"left","width":"25vw", "height":Utils.screenH+"px", "border": "1px solid black"}}>
						<OrchestrationDetail selectedNode={this.props.selectedNode}/>
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
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedEnterprise: store.OrchestrationReducer.selectedEnterprise,
			    	provider: store.OrchestrationReducer.provider
			    };
			  }
			)(_Orchestration2);
export default Orchestration
