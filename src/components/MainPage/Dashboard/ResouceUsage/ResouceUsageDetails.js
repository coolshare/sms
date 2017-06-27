import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Header from '../../../Header/Header'
import cs from '../../../../services/CommunicationService'

/**
*
*/
class _ResouceUsageDetails extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div>	
				<Header/>
				<div>
				ResouceUsageDetails
				</div>
      		</div>
		)
	}
}

const ResouceUsageDetails = connect(
		  store => {
			    return {
			    };
			  }
			)(_ResouceUsageDetails);
export default ResouceUsageDetails