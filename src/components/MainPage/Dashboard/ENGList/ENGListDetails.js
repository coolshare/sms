import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Header from '../../../Header/Header'
import cs from '../../../../common/CommunicationManager'

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
				<Dispatcher action={{"type":"/RemoteService/fatchThroughProxy"}}>ENGListDetails</Dispatcher>
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