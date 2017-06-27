import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import cs from '../../../../services/CommunicationService'

/**
*
*/
class _ENGListGadget extends Gadget {
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		
		let action = cs.routeData["ENGListDetails"];
		return (
			<div id="ENGList"style={{"height":"250px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>		
			<Dispatcher action={{"type":"pushPath", "action":action}}>{action.label}</Dispatcher>
      		</div>
		)
	}
}

const ENGListGadget = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGListGadget);
export default ENGListGadget