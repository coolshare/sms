import React from 'react'
import cm from '../../common/CommunicationManager'
import style from '../../common/css/common.css'
import style2 from './Login.css'
/**
* LoginForm
**/
export default class  Login extends React.Component{

	handleLogin= () => {
		cm.dispatch([{"type":"pushPath", "action":cm.routeData["Home"]}, {"type":"setUser", "data":{"user":this.userName.value, "password":this.password.value}}]);
	}
	/**
	* render
	* @return {ReactElement} markup
	*/
	render(){
		return (
			<div style={{"height":"100vh"}} className="grad LoginContainer">
				<div className="header_logo">NetElastic</div>
				<div className="header_logo2">System</div>
				<center>
					<div className="LoginDiv">
						<div className="LoginHeader"><center><h3>User Login</h3></center>
						</div>
						<form className="LoginForm" >
					            <div className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>
			    					<input name="email" type="text" tabIndex="1" placeholder="Email Address" style={{"width":"400px"}} ref = {(input) => { this.userName = input; }} />
					            </div>
					            <div className="field"   style={{'margin':'20px','width':'450px'}}>
			    					<input name="password" type="password" tabIndex="2" placeholder="Password" style={{"width":"400px"}} ref = {(input) => { this.password = input; }} />
					            </div>
					            
			    				<button onClick={this.handleLogin.bind(this)} style={{"marginTop":"20px", "marginLeft":"400px"}}>Log In</button>
			    				<div style={{"marginLeft":"20px"}}><a href="#">Forgot password</a></div>
			    		</form>
	    			</div>
    			</center>
			</div>
		);
	}
}

