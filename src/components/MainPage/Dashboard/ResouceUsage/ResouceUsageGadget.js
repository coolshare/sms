import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ResouceUsageGadget extends Gadget{
	constructor() {
		super("ResouceUsageGadget")
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
		let action = cm.routeData["ResouceUsageDetails"]
		return (
			<div id="ResouceUsage" style={{"padding":"9px"}}>	
				<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

const ResouceUsageGadget = connect(
		  store => {
			    return {
			    	gadget: store.DashboardReducer.gadgets["ResouceUsageGadget"]
			    };
			  }
			)(_ResouceUsageGadget);
export default ResouceUsageGadget