import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Header from '../../Header/Header'
import EnterpriseAdmin from './EnterpriseAdmin'

/**
*
*/
export default class Admin extends React.Component{
	
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){

		
		return (
			
			<div>
				<Header/>
				<EnterpriseAdmin/>
      		</div>
		)
	}
}
