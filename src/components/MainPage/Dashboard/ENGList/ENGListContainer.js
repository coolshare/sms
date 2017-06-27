import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
//import cs from '../../services/CommunicationService'

/**
*
*/
class _ENGList extends Gadget {
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div id="ENGList"style={{"height":"250px", "backgroundColor":"#58D3F7", "borderRadius":"10px", "margin":"9px", "padding":"9px"}}>		
			<Dispatcher action={{"type":"addPath", "action":{"name":"ENGList", "url":"", "icon":""}}}>ENGList</Dispatcher>
      		</div>
		)
	}
}

const ENGList = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGList);
export default ENGList