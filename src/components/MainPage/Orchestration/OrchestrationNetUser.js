import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cm from '../../../common/CommunicationManager'
import OrchestrationNetUserDetail from './OrchestrationDetail'
import OrchestrationNetUserHeader from './OrchestrationHeader'
import OrchestrationFloatMenu from './OrchestrationFloatMenu'


import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import {InternetNode, HostNode, PodNode} from './DiagramElements'
import Header from '../../../components/Header/Header'

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
	}
	componentDidMount() {
		let self = this;
		cm.subscribe("setSelectedTab", (action)=>{
			var tab = action.data;
			var data = cm.getStoreValue("OrchestrationReducer","tabData")
			if (tab==="Provider") {
				self.buildDiagram(data.Provider, tab)
			} else if (tab==="Enterprise") {
				if (self.props.selectedEnterprise!==null) {
					self.buildDiagram(data.Enterprise[self.props.selectedEnterprise], tab)
				}
				
			}
		
			
		})
		var data = {
				"Provider":{
					"nodes":[
						{ "id":"Welmart", "type":"Enterprise", "label":"Welmart", "r": 20, "xx":100, "yy":100 , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16},
					    { "id":"Target", "type":"Enterprise", "label":"Target", "r": 20, "xx":200, "yy":100 , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16},
					    { "id":"BurgerKing", "type":"Enterprise", "label":"BurgerKing", "r": 20, "xx":300, "yy":100 , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16},
					    { "id":"Frys", "type":"Enterprise", "label":"Frys", "r": 20, "xx":400, "yy":100 , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16},
					    { "id":"BestBuy", "type":"Enterprise", "label":"BestBuy", "r": 20, "xx":500, "yy":100 , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16}

					],"links": [
					]
				},
				"Enterprise":{}			
		}
		for (var i=0; i<data.Provider.nodes.length; i++) {
			var id = data.Provider.nodes[i].id;
		
			data.Enterprise[id] = {"nodes":[], "links":[]};
			var list = data.Enterprise[id].nodes;
			var max = 3;//+Math.floor(Math.random()*5);
			for (var j=0; j<max; j++) {
				list.push({ "id":id+j, "type":"Branch", "label":id+" branch "+j, "r": 20, "xx":100, "yy":50+80*j , "image":"gcp", "fontDy":35, "state":0, "innerColor":"#E1E1E1", "iconX":0, "iconY":0, "iconW":16, "iconH":16});
			}
			
		}
		
		//for (var i=1; i<data.nodes.length; i++) {
		//	data["Enterprise"].links.push({ source: data["Enterprise"].nodes[0], target:data.nodes[i] });
		//}
	    cm.dispatch({"type":"setTabData", "data":data})
		
	    if (data.Provider && Object.keys(data.Provider.nodes).length>0) {	    	
	    	this.buildDiagram(data.Provider, this.props.selectedTab)
	    }
		
		
	}
	
	handleNodeClick(d) {	
	
		if (d.type==="Enterprise") {
			cm.dispatch({"type":"setSelectedEnterprise", "data":d.id})
			cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})
			
			
		}
	}

	handleProvider(data) {
		return [];
	}
	handleEnterprise(data) {
	  let cloudeProviders = data;
	  var res = [];
	  for (var c in cloudeProviders) {
		let cloudeProvider = cloudeProviders[c];
		if (cloudeProvider.Instances===undefined) {
			continue;
		}

		for (var m in cloudeProvider.Children) {
			let instance = cloudeProvider.Children[m];
			if (instance.Children!==undefined) {
				for (var n=0; n<instance.Children.length;n++) {
					let pod = instance.Children[n];
					res.push(new PodNode(this, {"Type":"Pod", "id":pod.id, "Name":pod.Name, "CloudProvider":pod.CloudProvider, "Parent":undefined}, 0))
				}
			}
		}
	  }
	  return res; 
	}	
	
	buildDiagram(data, selectedTab) {
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
		} else {
			this.state.diagram.selectAll("*").remove();
		 }     
		      
			  
		var nodes = data.nodes
		var links = data.links;
		var collide = [60, 300, 50];
		if (links.length===0) {
			collide = [10, 200, 20];
		}
		var simulation = d3.forceSimulation()
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
		  .call(d3.drag()
		    .on("start", dragstarted)
		    .on("drag", dragged)
		    .on("end", dragended));
		node.append("circle")
		.attr("r", function(d){return d.r;})
		.style("stroke-width", 1)    // set the stroke width
		.style("stroke", "black")  
		.style("cursor", "pointer")  
		.style("fill", function(d) {return stateColors[d.state]})
		.on("click", (d)=>{
			self.handleNodeClick(d)
		})
		node.append("circle")
		.attr("r", function(d){return d.r-5;})
		.style("fill", function(d) {return d.innerColor})  
		.style("cursor", "pointer")
		.on("click", (d)=>{
			self.handleNodeClick(d)
		})
		/*.on('contextmenu', function(d) {
	    		d.createMenu();
	    	}
		);*/
		
		node.append("svg:image").attr("xlink:href", function(d) {
		return "http://www.coolshare.com/temp/"+d.image+".png"
		} ).attr("x", function(d) {return d.iconX})
			.attr("y", function(d) {return d.iconY}).attr("width", function(d) {return d.iconW}).attr("height",  function(d) {return d.iconH})  
			.style("cursor", "pointer")
			.on("click", (d)=>{
				self.handleNodeClick(d)
			})
				
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
		simulation
		  .nodes(nodes)
		  .on("tick", ticked);

		simulation.force("link")
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

		  node
		    .attr("transform", function(d) {
		      return "translate(" + d.xx + ", " + d.yy + ")";
		    })
		}

		function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.5).restart()
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = undefined;
		  d.fy = undefined;
		}
	
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
			    	tabData: store.OrchestrationReducer.tabData
			    };
			  }
			)(_OrchestrationNetUser);
export default OrchestrationNetUser
