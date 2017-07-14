import React from 'react';
import {connect} from 'react-redux'
import ReactDOM, {findDOMNode} from "react-dom";
import cm from '../../../common/CommunicationManager'

const numCol = 2;

class _DashboardContainer extends React.Component{
	constructor() {
		super();
		this.drop = this.drop.bind(this);
		this.dragStart = this.dragStart.bind(this);
		this.dragOver = this.dragOver.bind(this);
		cm.gadgetStateMap = {				
				"ResouceUsageGadget":{"name":"ResouceUsageGadget", "path":"./ResouceUsage/ResouceUsageGadget", "state":"normal"},
				"ENGAlertsGadget":{"name":"ENGAlertsGadget", "path":"./ENGAlerts/ENGAlertsGadget", "state":"normal"},
				"ENGListGadget":{"name":"ENGListGadget", "path":"./ENGList/ENGListGadget", "state":"normal"}
			};
		
		for (let k in cm.gadgetStateMap) {
			let g = cm.gadgetStateMap[k];
			let type = require(g.path).default;
			g.elem = React.createElement(type)
		}
		cm.dispatch({"type":"setGadgets", "data":cm.gadgetStateMap})
	}
	adjustPosition = ()=> {
		
	}
	dragStart = (event) => {
		this.dragTarget = event.currentTarget;
		this.container = findDOMNode(this.refs.dropContainer);
		this.container.style.cursor = "pointer"
	    var data = {
	      name: 'foobar',
	      age: 15 
	    };
		
	    event.dataTransfer.setData('text', JSON.stringify(data)); 
	    console.log("dragStart:"+this.container.style.cursor)
	  }
	drop = (event) => {
		console.log("drop: x="+event.clientX+" y="+event.clientY)
	    event.preventDefault();
		this.adjustPosition();
		this.container.style.cursor = "default"
	    var data;

	    try {
	      data = JSON.parse(event.dataTransfer.getData('text'));
	    } catch (e) {
	      // If the text data isn't parsable we'll just ignore it.
	      return;
	    }

	    // Do something with the data
	    console.log(data);

	  }
	dragOver(event) {
		 //console.log("dragOver:"+this.container.style.cursor)
		event.preventDefault();
		//console.log("dragOver")
		this.container.style.cursor = "pointer"
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		var self = this;
		var gadgets = Object.keys(this.props.gadgets).length>0?this.props.gadgets:null;
		

		if (gadgets===null || this.props.mainContainerSize===undefined) {
			return null;
		}
		var maxElem = null;
		for (let k in gadgets) {
			let elem = gadgets[k];
			if (elem.state==="max") {
				maxElem = elem;
				break;
			}
		}
		let elems = Object.keys(gadgets).map((k, idx)=>{
			let gadget = gadgets[k];
			if (gadgets==null || ((maxElem===null||maxElem===gadgets[k]) && gadget.state!=="min" && gadget.state!=="close")) {
				return (<div key={idx} draggable='true' onDragStart={self.dragStart}>{React.cloneElement(gadget.elem, {"gadget":gadget, "mainContainerSize":this.props.mainContainerSize})}</div>)
			} else if (gadget.state!=="min" && maxElem===null){
				return (<div key={idx} draggable='true' onDragStart={self.dragStart}>{React.cloneElement(gadget.elem, {"gadget":gadget, "mainContainerSize":this.props.mainContainerSize})}</div>)
			} else {
				return null;
			}			
		})
		let minElems = Object.keys(gadgets).map((k, idx)=>{
			let gadget = gadgets[k];
			if (gadget.state==="min"){
				return (<div key={idx} draggable='true' onDragStart={self.dragStart}>{React.cloneElement(gadget.elem, {"gadget":gadget, "mainContainerSize":this.props.mainContainerSize})}</div>)
			} else {
				return null;
			}			
		})
		return (
				<div id="dropContainer" ref="dropContainer" onDragOver={(e)=>this.dragOver(e)} onDrop={this.drop} style={{"width":this.props.mainContainerSize.w, "height":this.props.mainContainerSize.h}}>
				<div style={{"height":"90%"}}>{elems}</div>
				{maxElem===null && <div id="minContainer" style={{"width":"100%", "height":"10%"}}>{minElems}</div>}
				</div>
		)
	
	}
}

const DashboardContainer = connect(
		  store => {
			    return {
			    	gadgets: store.DashboardReducer.gadgets,
			    	mainContainerSize: store.MainContainerReducer.mainContainerSize
			    };
			  }
			)(_DashboardContainer);
export default DashboardContainer

