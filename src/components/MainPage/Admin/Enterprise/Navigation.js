import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../../common/CommunicationManager'
import style from './Navigation.css'


/**
*
*/
export default class Navigation extends React.Component{
	
	handleUserManagement = () => {
		cm.dispatch({"type":"loadAdminUser", "data":"UserAdmin"})
		
	}
	
	handleGroupManagement = () => {
		cm.dispatch({"type":"loadAdminGroup", "data":"GroupAdmin"})
	}
	
	handleEnterpriseManagement = () => {
		{/* link to this page */}
		
	}
	
	
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){

		return (
			<nav className = "sidenav">
					
					<span className= "eachLink" onClick={this.handleUserManagement.bind(this)}>User Management</span>
					
					<span className= "eachLink" onClick={this.handleGroupManagement.bind(this)}>Group Management</span>
				
	        </nav>
		)
	}
}

