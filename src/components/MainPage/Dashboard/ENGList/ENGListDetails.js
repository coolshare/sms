import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Header from '../../../Header/Header'
import cs from '../../../../services/CommunicationService'

/**
*
*/
class _ENGListDetails extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div>	
				<Header/>
				<div>
				ENGListDetails
				</div>
      		</div>
		)
	}
}

const ENGListDetails = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGListDetails);
export default ENGListDetails