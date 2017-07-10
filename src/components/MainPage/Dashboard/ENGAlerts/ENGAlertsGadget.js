import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
export default class ENGAlertsGadget extends Gadget{
	constructor() {
		super("ENGAlertsGadget")
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
		let action = cm.routeData["ENGAlertsDetails"]
		return (
			<div id="ENGAlerts" style={{"padding":"9px"}}>	
				<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

