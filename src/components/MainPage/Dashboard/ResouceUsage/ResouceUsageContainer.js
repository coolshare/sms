import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
//import cs from '../../services/CommunicationService'

/**
*
*/
class _ResouceUsage extends Gadget{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div id="ResouceUsage" style={{"height":"250px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>		
				<Dispatcher action={{"type":"addPath", "action":{"name":"ResouceUsage", "url":"", "icon":""}}}>ResouceUsage</Dispatcher>
      		</div>
		)
	}
}

const ResouceUsage = connect(
		  store => {
			    return {
			    };
			  }
			)(_ResouceUsage);
export default ResouceUsage