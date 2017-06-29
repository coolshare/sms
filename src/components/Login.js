import React from 'react'
import Dispatcher from '../common/Dispatcher'
import cm from '../services/CommunicationService'
/**
* LoginForm
**/
export default class  Login extends React.Component{

	/**
	* render
	* @return {ReactElement} markup
	*/
	render(){
		return (	
			<div className="form_container" style={{margin:'20px'}}>
				<div className="header_logo"></div>
				<form className="form-login" >
		            <div className="field"  style={{margin:'10px'}}>
    					<input name="email" type="text" tabIndex="1" placeholder="Email Address"/>
		            </div>
		            <div className="field"   style={{margin:'10px'}}>
    					<input name="password" type="password" tabIndex="2" placeholder="Password"/>
		            </div>
		            
    				<Dispatcher action={{"type":"pushPath", "action":cm.routeData["Home"]}}><button>Log In</button></Dispatcher>
    				
					<div>This page is only a place holder for a login screen:</div>
					<p>Just click at "Log in" button to continue</p>
    			</form>
			</div> 
		);
	}
}

