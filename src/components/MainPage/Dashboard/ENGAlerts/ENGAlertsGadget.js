import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ENGAlertsGadget extends Gadget{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		
		let action = cm.routeData["ENGAlertsDetails"]
		return (
			<div id="ENGAlerts" style={{"height":"250px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>	
				<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

const ENGAlertsGadget = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGAlertsGadget);
export default ENGAlertsGadget