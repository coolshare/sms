import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
export default class ENGListGadget extends Gadget {
	constructor() {
		super("ENGListGadget")
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
		let action = cm.routeData["ENGListDetails"]
		return (
			<div id="ENGList" style={{"padding":"9px"}}>	
			<Dispatcher action={{"type":"pushPath", "data":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}
