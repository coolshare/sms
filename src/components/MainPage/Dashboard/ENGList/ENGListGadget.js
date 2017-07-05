import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ENGListGadget extends Gadget {
	constructor() {
		super("ENGListGadget")
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
		let action = cm.routeData["ENGListDetails"];
		return (
			<div id="ENGList" style={{"padding":"9px"}}>	
			<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

const ENGListGadget = connect(
		  store => {
			    return {
			    	gadget: store.DashboardReducer.gadgets["ENGListGadget"]
			    };
			  }
			)(_ENGListGadget);
export default ENGListGadget