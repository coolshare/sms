import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'
import style from './Orchestration.css'
import OrchestrationDiagram from './OrchestrationDiagram'

/**
*
*/
export default class OrchestrationGadget extends Gadget {
	constructor() {
		super("OrchestrationGadget")
	}
	
	/**
    * render
    * @return {ReactElement} markup
    */
	renderMe(){

		let gadget = this.props.gadget;
		if (gadget===undefined) {
			return null;
		}
		let action = cm.routeData["OrchestrationDetails"]
		return (
				<div id="orchestrationCanvas">
				<OrchestrationDiagram mainContainerSize={this.props.mainContainerSize} gadget={this.props.gadget}/>
				</div>
		)
	}
}
