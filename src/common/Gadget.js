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
		this.gadgetState = {"name":this.name, "elem":this, "state":"normal"};
		
		cm.dispatch({"type":"registerGadget", "data":this.gadgetState})
	}
	handleMin = () => {
		cm.dispatch({"type":"GadgetMin", "data":this.gadgetState.name})
	}
	handleMax = () => {
		cm.dispatch({"type":"GadgetMax", "data":this.gadgetState.name})
	}
	handleRestore = () => {
		cm.dispatch({"type":"GadgetRestore", "data":this.gadgetState.name})
	}
	handleClose = () => {
		cm.dispatch({"type":"GadgetClose", "data":this.gadgetState.name})
	}
	renderHeader() {
		if (this.gadgetState===undefined) {
			return null;
		}
		console.log("state="+this.gadgetState.state)
		return (
			<div>
				<FA name='window-close' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleClose}/>
				{this.gadgetState.state==="normal"&&<FA name='window-maximize' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleMax}/>}
				{(this.gadgetState.state==="min" || this.gadgetState.state==="max")&&<FA name='window-restore' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleRestore}/>}
				<FA name='window-minimize' style={{"float":"right", "marginRight":"5px", "cursor":"pointer"}} onClick={this.handleMin}/>
			</div>
		)
	}
	renderMe() {
		return null;
	}
	render() {
		let mainContainerSize = cm.mainContainerSize;
		let w = this.gadgetState.state==="max"?mainContainerSize[0]:this.w;
		let h = this.gadgetState.state==="max"?mainContainerSize[1]:this.h;
		
		return (
			<div style={{"float":"left", "width":w+"px", "height":h+"px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>
				{this.renderHeader()}
				{this.renderMe()}
			</div>
		)
	}
	
}