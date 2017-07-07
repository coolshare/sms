import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
export default class ResouceUsageGadget extends Gadget{
	constructor() {
		super("ResouceUsageGadget")
		debugger
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	renderMe(){
		if (this.props.gadgets===undefined) {
			return null;
		}
		let gadget = this.props.gadgets[this.name];
		let action = cm.routeData["ResouceUsageDetails"]
		return (
			<div id="ResouceUsage" style={{"padding":"9px"}}>	
				<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}
