import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ENGAlertsGadget extends Gadget{
	constructor() {
		super("ENGAlertsGadget")
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	renderMe(){
		if (this.props.gadget===undefined) {
			return null;
		}
		this.gadgetState = this.props.gadget;
		let action = cm.routeData["ENGAlertsDetails"]
		return (
			<div id="ENGAlerts" style={{"padding":"9px"}}>	
				<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

const ENGAlertsGadget = connect(
		  store => {
			    return {
			    	gadget: store.DashboardReducer.gadgets["ENGAlertsGadget"]
			    };
			  }
			)(_ENGAlertsGadget);
export default ENGAlertsGadget