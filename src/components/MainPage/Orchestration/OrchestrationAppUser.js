import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cs from '../../../services/CommunicationService'
import OrchestrationDetail from './OrchestrationDetail'
import OrchestrationHeader from './OrchestrationHeader'
import {PopupCloseBox} from '../../../common/PopupComponents'
import RemoteService from '../../../services/RemoteService'
import Utils from '../../../common/Utils'
import {UserNode, InternetNode, DomainNode, PodNode} from './DiagramElements'

const ddd = {
		"CloudeProviders":[
		    {"Id":"id_1", "Name":"AWS", "Type":"CloudeProvider", "ExpandState":1, "ChildType":"Node", "Children":[]},
		    {"Id":"id_2", "Name":"GCP", "Type":"CloudeProvider", "ExpandState":1, "ChildType":"Node", "Children":[]},
		    {"Id":"id_3", "Name":"Linode", "Type":"CloudeProvider","ExpandState":1, "ChildType":"Node", "Children":[]}
		 ]
	}

const stateColors = ["green", "yellow", "orange", "pink", "red"]

class _OrchestrationAppUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:null
		}
		this.canvasX = 10;
		this.canvasY = 15;
		this.diagramW = 800;
		this.diagramH = 5000;
		this.nodeMap = {}
		this.elemNodeMap = {}
		this.contextMenuShowing = false;
		this.dragHandler = null;
		this.idCount = 110;
		this.linkMap = {};
		this.orchestrationData = null;
		this.initZoom = .5;
		this.isInit = false;
		this.zoomFactor = this.initZoom
	}
	componentDidMount() {
		let self = this;
		
		this.subscriber1 = cs.subscribe("expandOrchestrationNode", function() {
			let data = cs.getState("OrchestrationReducer").data;
			cs.dispatch({"type":"setOrchestrationData", "data":data})
			
			let gg = self.createDiagram(data);
			self.setState({"data":gg}, this);
		})
		this.subscriber3 = cs.subscribe("addLink", ()=> {
			let data = cs.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		this.subscriber2 = cs.subscribe("removeLink", ()=> {
			let data = cs.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		this.subscriber4 = cs.subscribe("addNode", ()=> {
			let data = cs.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		
		
		
		this.sub0 = cs.subscribe("NodeService", ()=> {
			self.createDiagram(cs.getStoreValue("CommonReducer", "globalData"))
		})
		
		this.sub1 = cs.subscribe("selectOrchestrationNode", ()=> {
			nm.selectNode(cs.getStoreValue("OrchestrationReducer", "selectedNode"))
		})
		
		if (cs.getStoreValue("CommonReducer", "appLoaded")) {
			self.createDiagram(cs.getStoreValue("CommonReducer", "globalData"))
		} else {
			console.log("App is not loaded when init OrchestrationAppUser")
		}
		
	}
	
	componentWillUnmount() {
		if (this.sub0) {
			this.sub0();
		}
		if (this.sub1) {
			this.sub1();
		}
		
		if (this.subscriber1) {
			this.subscriber1();
		}
		if (this.subscriber2) {
			this.subscriber2();
		}
		if (this.subscriber3) {
			this.subscriber3();
		}
		if (this.subscriber4) {
			this.subscriber4();
		}
	}

	createDiagram(data) {
		var self = this;
		this.orchestrationData = data;
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
		var nodes = [new DomainNode(this, {"Type":"Node", "id":"Domain1", "Name":"Domain", "Parent":"Internet"}, 0),
		             new PodNode(this, {"Type":"Pod", "id":"Video", "Name":"Video", "CloudProvider":"AWS", "Parent":"Domain1"}, 2),
		             new PodNode(this, {"Type":"Pod", "id":"Audio", "Name":"Audio", "CloudProvider":"Linode", "Parent":"Domain1"}, 0),
		             new PodNode(this, {"Type":"Pod", "id":"Asset", "Name":"Asset", "CloudProvider":"GCP", "Parent":"Domain1"}, 0),
		             new PodNode(this, {"Type":"Pod", "id":"Avatar", "Name":"Avatar", "CloudProvider":"AWS", "Parent":"Domain1"}, 4),
		             new PodNode(this, {"Type":"Pod", "id":"Messages", "Name":"Messages", "CloudProvider":"GCP", "Parent":"Domain1"}, 2),
		             new PodNode(this, {"Type":"Pod", "id":"Scriptd-agent", "Name":"Scriptd-agent", "CloudProvider":"AWS", "Parent":"Domain1"}, 1),
		             new PodNode(this, {"Type":"Pod", "id":"Entity-script", "Name":"Entity-script", "CloudProvider":"Linode", "Parent":"Domain1"}, 0),
		             new PodNode(this, {"Type":"Pod", "id":"Entity", "Name":"Entity", "CloudProvider":"AWS", "Parent":"Domain1"}, 2),
		             new InternetNode(this, {"Type":"Internet", "id":"Internet", "Name":"Internet", "CloudProvider":"Internet", "Parent":"User"}, 2),
		             new UserNode(this, {"Type":"User", "id":"User", "Name":"User", "CloudProvider":"User"}, 2)
		 ];

		var links = [];
		for (var i=0; i<nodes.length; i++) {
			var node = nodes[i]
			if (node.node.Parent!==undefined) {
				links.push({"source":node.id, "target":node.node.Parent})
			}
		}

		var  node, link;

		var simulation = d3.forceSimulation()
		  .force("link", d3.forceLink().id(function(d) {
		    return d.id;
		  }).distance(50))
		  .force("collide", d3.forceCollide(50))
		  .force("charge", d3.forceManyBody())
		  .force("center", d3.forceCenter(200, 200));

		link = this.state.diagram.selectAll(".link")
		  .data(links, function(d) {
		    return d.target.id;
		  })

		link = link.enter()
		  .append("line")
		  .attr("class", "link");

		node = this.state.diagram.selectAll(".node")
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
		.style("fill", function(d) {return stateColors[d.state]})
		node.append("circle")
		.attr("r", function(d){return d.r-3;})
		.style("fill", function(d) {return d.innerColor})
		.on('contextmenu', function(d) {
	    		d.createMenu();
	    	}
		);
		node.append("svg:image").attr("xlink:href", function(d) {
		return "http://www.coolshare.com/temp/"+d.image+".png"
		} ).attr("x", function(d) {return d.iconX})
						.attr("y", function(d) {return d.iconY}).attr("width", function(d) {return d.iconW}).attr("height",  function(d) {return d.iconH});
				
		node.append("text").text(function(d) {
			return d.label;
			} )
			.style("font-size", function(d) { return "12px"; })
      .attr("dx", "-1.55em").attr("dy", function(d){return d.fontDy});
		
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
		      return "translate(" + d.x + ", " + d.y + ")";
		    });
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
	
	}
	  
	render() {
	    return (
	    	<div style={{"minHeight":Utils.screenH+"px"}}>
	    		{cs.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
	    		<div style={{"float":"left"}}>
			    	<div id="svg" style={{"height":Utils.screenH+"px", "width":"70vw"}}>
			      		
					</div>
				</div>	
			</div>
	    )
	}
}
const OrchestrationAppUser = connect(
		  store => {
			    return {
			    	data: store.OrchestrationReducer.data,
			    	selectedNode: store.OrchestrationReducer.selectedNode,
			    	OrchestrationData: store.OrchestrationReducer.OrchestrationData
			    };
			  }
			)(_OrchestrationAppUser);
export default OrchestrationAppUser	
