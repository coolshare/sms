import React from 'react';
import {connect} from 'react-redux'
import * as d3 from "d3";
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'
import style from './Orchestration.css'

/**
*
*/
export default class OrchestrationDiagram extends Gadget {
	constructor() {
		super("OrchestrationDiagram")
	}
	componentDidMount() {
		var self = this;
		cm.subscribe("refreshOrchestration", ()=>{
			self.buildGraph();
		})
		this.buildGraph();
	}
	
	buildGraph = () => {
		
		let gadget = this.props.gadget;
		 var w = gadget.state==="max"?this.props.mainContainerSize.w:this.w;
		 var h = gadget.state==="max"?this.props.mainContainerSize.h:this.h-50;
		 var margin = {top: 20, right: 20, bottom: 20, left: 20},
		    width = w - margin.left - margin.right,
		    height = h - margin.top - margin.bottom;
		 
		if (this.svg!==undefined) {
			this.svg.selectAll("*").remove();
			this.svg.attr("width", width + margin.left + margin.right)
		      .attr("height", height + margin.top + margin.bottom);
		} else {
			this.svg = d3.select("#orchestrationCanvas").append("svg")
		      .attr("width", w + margin.left + margin.right)
		      .attr("height", h + margin.top + margin.bottom);
		}
		var treeData =
		  {
		    "name": "Att",
		    "value": 10,
		    "type": "black",
		    "level": "red",
		    "children": [
		      {
		        "name": "Walmart",
		        "value": 15,
		        "type": "grey",
		        "level": "red",
		        "children": [
		          {
		            "name": "1201 Union Ave, Newburgh",
		            "value": 5,
		            "type": "steelblue",
		            "level": "orange"
		          },
		          {
		            "name": "288 Larkin Dr, Monroe",
		            "value": 8,
		            "type": "steelblue",
		            "level": "red"
		          }
		        ]
		      },
		      {
		        "name": "Target",
		        "value": 10,
		        "type": "grey",
		        "level": "green"
		      }
		    ]
		  };
		

		// set the dimensions and margins of the diagram
		

		// declares a tree layout and assigns the size
		var treemap = d3.tree()
		    .size([height, width]);

		//  assigns the data to a hierarchy using parent-child relationships
		var nodes = d3.hierarchy(treeData, function(d) {
		    return d.children;
		  });

		// maps the node data to the tree layout
		nodes = treemap(nodes);

		// append the svg object to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		
		    var g = this.svg.append("g")
		      .attr("transform",
		            "translate(" + margin.left + "," + margin.top + ")");

		// adds the links between the nodes
		var link = g.selectAll(".link")
		    .data( nodes.descendants().slice(1))
		  .enter().append("path")
		    .attr("class", "link")
		    .style("stroke", function(d) { return d.data.level; })
		    .attr("d", function(d) {
		       return "M" + d.y + "," + d.x
		         + "C" + (d.y + d.parent.y) / 2 + "," + d.x
		         + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
		         + " " + d.parent.y + "," + d.parent.x;
		       });

		// adds each node as a group
		var node = g.selectAll(".node")
		    .data(nodes.descendants())
		  .enter().append("g")
		    .attr("class", function(d) { 
		      return "node" + 
		        (d.children ? " node--internal" : " node--leaf"); })
		    .attr("transform", function(d) { 
		      return "translate(" + d.y + "," + d.x + ")"; });

		// adds the circle to the node
		node.append("circle")
		  .attr("r", function(d) { return d.data.value; })
		  .style("stroke", function(d) { return d.data.type; })
		  .style("fill", function(d) { return d.data.level; });
		  
		// adds the text to the node
		node.append("text")
		  .attr("dy", ".35em")
		  .attr("x", function(d) { return d.children ? 
		    (d.data.value + 4) * -1 : d.data.value + 4 })
		  .style("text-anchor", function(d) { 
		    return d.children ? "end" : "start"; })
		  .text(function(d) { return d.data.name; });
    }
	
	handleAddTenant() {
		
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		
		let gadget = this.props.gadget;
		if (gadget===undefined) {
			return null;
		}
		let action = cm.routeData["OrchestrationDetails"]
		
		return (
				<div>
					<div>
						<div style={{"width":"100%", "height":"50px", "backgroundColor":"#D1D1D1"}}>
							<a style={{"marginLeft":"5px", "cursor":"pointer"}} onClick={this.handleAddTenant.bind(this)}>Add Tenant</a>
						</div>
						
						<div id="orchestrationCanvas"/>
					</div>
					<div id="orchestTooltip" className="hidden">
						<p><span id="value"></span></p>
					</div>
					<div id="detailPane" style={{"width":"300px", "height":"500px", "position":"absolute", "top":"55px", "left":"2000px", "zIndex":"999","backgroundColor":"#D1D1D1"}}>
						<center><h4 id="detailTitle"></h4></center>
					</div>

				</div>
		)
	}
}

	
	
