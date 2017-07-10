import React from 'react';
import {connect} from 'react-redux'
import FA from 'react-fontawesome'
import cm from './CommunicationManager'

/**
*
*/
export default class Gadget extends React.Component{
	constructor(name) {
		super();
		this.name = name;
		this.w = 300;
		this.h = 250;
		this.handleMin = this.handleMin.bind(this)
		this.handleMax = this.handleMax.bind(this)
		this.handleRestore = this.handleRestore.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.renderHeader = this.renderHeader.bind(this)
	}
	handleMin = () => {
		cm.dispatch({"type":"GadgetMin", "data":this.name})
	}
	handleMax = () => {
		cm.dispatch({"type":"GadgetMax", "data":this.name})
	}
	handleRestore = () => {
		cm.dispatch({"type":"GadgetRestore", "data":this.name})
	}
	handleClose = () => {
		cm.dispatch({"type":"GadgetClose", "data":this.name})
	}
	renderHeader() {
		let gadget = this.props.gadget;
	
		if (gadget===undefined) {
			return null;
		}

		console.log("state="+gadget.state)
		return (
			<div>
				<FA name='window-close' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleClose}/>
				{gadget.state==="normal"&&<FA name='window-maximize' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleMax}/>}
				{(gadget.state==="min" || gadget.state==="max")&&<FA name='window-restore' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleRestore}/>}
				<FA name='window-minimize' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleMin}/>
			</div>
		)
	}
	renderMe() {
		return null;
	}
	render() {
		let gadget = this.props.gadget;
		if (gadget===undefined) {
			return null;
		}
		let mainContainerSize = cm.mainContainerSize;
		let w = gadget.state==="max"?mainContainerSize.w:this.w;
		let h = gadget.state==="max"?mainContainerSize.h:this.h;
		
		return (
			<div style={{"float":"left", "width":w+"px", "height":h+"px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>
				{this.renderHeader()}
				{this.renderMe()}
			</div>
		)
	}
	
}
				
