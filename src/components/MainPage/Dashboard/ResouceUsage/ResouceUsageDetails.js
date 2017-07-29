import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Header from '../../../Header/Header'
import cm from '../../../../common/CommunicationManager'

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
				ResouceUsageDetails
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