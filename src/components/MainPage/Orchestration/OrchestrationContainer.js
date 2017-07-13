import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import cm from '../../../common/CommunicationManager'
import nm from './NodeManager'
import OrchestrationDetail from './OrchestrationDetail'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Header from '../../../components/Header/Header'

const ddd = {
		"CloudeProviders":[
		    {"Id":"id_1", "Name":"AWS", "Type":"CloudeProvider", "ExpandState":1, "ChildType":"Node", "Children":[]},
		    {"Id":"id_2", "Name":"GCP", "Type":"CloudeProvider", "ExpandState":1, "ChildType":"Node", "Children":[]},
		    {"Id":"id_3", "Name":"Linode", "Type":"CloudeProvider","ExpandState":1, "ChildType":"Node", "Children":[]}
		 ]
	}



class OchestrationNode {
	constructor(id, name, type, expandState, childType) {
		this.id = id;
		this.Name = name;
		this.Type = type;
		this.ExpandState = expandState;
		this.ChildType = childType;
		this.Children = [];
		
	}
}

class _OrchestrationContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:null
		}
		this.canvasX = 10;
		this.canvasY = 15;
		this.libW = 150;
		this.libH = 500;
		this.diagramW = 600;
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
		
		this.subscriber1 = cm.subscribe("expandOrchestrationNode", function() {
			let data = cm.getState("OrchestrationReducer").data;
			cm.dispatch({"type":"setOrchestrationData", "data":data})
			
			let gg = self.createDiagram(data);
			self.setState({"data":gg}, this);
		})
		this.subscriber3 = cm.subscribe("addLink", ()=> {
			let data = cm.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		this.subscriber2 = cm.subscribe("removeLink", ()=> {
			let data = cm.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		this.subscriber4 = cm.subscribe("addNode", ()=> {
			let data = cm.getState("OrchestrationReducer").OrchestrationData;
			let gg = this.createDiagram(data);
			this.setState({"data":gg});
		})
		
		
		
		this.sub0 = cm.subscribe("NodeService", ()=> {
			self.createDiagram(cm.getStoreValue("CommonReducer", "globalData"))
		})
		
		this.sub1 = cm.subscribe("selectOrchestrationNode", ()=> {
			nm.selectNode(cm.getStoreValue("OrchestrationReducer", "selectedNode"))
		})
		
		if (cm.getStoreValue("CommonReducer", "appLoaded")) {
			self.createDiagram(cm.getStoreValue("CommonReducer", "globalData"))
		} else {
			console.log("App is not loaded when init OrchestrationContainer")
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
			  /*this.state.lib = d3.select(this.state.gg).append("svg")
		      .attr("width", this.libW+"px")
		      .attr("height", this.diagramH+"px").attr("x", this.canvasX).attr("y", this.canvasY);*/ 
				  
			  this.state.diagram = d3.select(this.state.gg).append("svg")
			  .attr("width", (this.libW+this.diagramW)+"px")
		      .attr("height", this.diagramH+"px").attr("x", this.canvasX).attr("y", this.canvasY)
		      .attr("transform", "translate(" + 0 + "," + 0 + ")")
			  
			  this.lg = this.state.diagram.append("g")
		      .attr("width", (this.libW)+"px")
		      .attr("height", this.diagramH+"px").attr("x", this.canvasX).attr("y", this.canvasY)
		      .attr("transform", "translate(" + 0 + "," + 0 + ")");
			  
			  this.dg = this.state.diagram.append("g")
		      .attr("width", (this.diagramW)+"px")
		      .attr("height", this.diagramH+"px").attr("x", this.canvasX).attr("y", this.canvasY)
		      .attr("transform", "translate(" + this.libW + "," + 20 + ")scale("+this.initZoom+","+this.initZoom+")");
			  this.dg.on("mousemove", ()=>{
				  //console.log("e.x="+d3.event.x+" e.y="+d3.event.y)
				  if (self.dragHandler===null) {
					  return;
				  }
				  self.dragHandler(d3.event);
				  
			  }).on("click", ()=>{
				  self.state.diagram.style("cursor", "default")
				  if (this.selectedNode) {
					  this.selectedNode.handleSelection(false);
				  }
				  
				  if (self.pendingLink===undefined) {
					  return;
				  }
				  self.isAddingLink = false;
				  self.pendingLink.remove();		
				  self.dragHandler = null;
				  delete self.pendingLink;
				  
				  
				  
			  }).call(d3.zoom()
				        .scaleExtent([1 / 16, 1.2])
				        .on("zoom", function() {
				        	let tt = d3.event.transform;
				        	tt.x = self.libW+10;
				        	tt.y = 20;
				        	self.zoomFactor = tt.k;
				        	if (!self.isInit) {
				        		tt.k = self.initZoom
				        		self.isInit = true;
				        	}
				        	console.log("x="+tt.x+" y="+tt.y)
				        	self.dg.attr("transform", tt);
				        }));
			  
			   
		  } else {
			  this.lg.selectAll("*").remove();
			  this.dg.selectAll("*").remove();
			  this.linkMap = {};
			  this.nodeMap = {};
			  this.elemNodeMap = {};
		  }
		  
		  
		  
		  //let ss = svg.append("svg:g");
		  nm.loadNodes("loadOrchestrationContainer", this, this.dg, data);
		  nm.loadLib(this, this.lg, data);
		  if (this.isAddingLink) {
			  this.pendingLink.restore();
		  }
		  return this.state.gg;
	}
	  
	render() {
	    return (
	    	<div>				
				<Header/>	
				<div style={{"minHeight":Utils.screenH+"px"}}>
		    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
			    	<div id="svg" style={{"float":"left", "height":Utils.screenH+"px", "width":"70vw"}}>
			      		
					</div>
					<div style={{"float":"left","width":"25vw", "height":Utils.screenH+"px", "border": "1px solid black"}}>
						<OrchestrationDetail selectedNode={this.props.selectedNode}/>
					</div>
					<div id="orchestTooltip" class="hidden">
					    <p><span id="value"></span></p>
				    </div>
				</div>
      		</div>
	    	
	    )
	}
}
const OrchestrationContainer = connect(
		  store => {
			    return {
			    	data: store.OrchestrationReducer.data,
			    	selectedNode: store.OrchestrationReducer.selectedNode,
			    	OrchestrationData: store.OrchestrationReducer.OrchestrationData
			    };
			  }
			)(_OrchestrationContainer);
export default OrchestrationContainer	
