import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Gadget from '../../../../common/Gadget'
import Header from '../../../Header/Header'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ENGAlertsDetails extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div>	
				<Header/>
				<div>
				ENGAlertsDetails
				</div>
      		</div>
		)
	}
}

const ENGAlertsDetails = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGAlertsDetails);
export default ENGAlertsDetails