import React from 'react'
import {connect} from 'react-redux'
import cm from '../../common/CommunicationManager'
import style from '../../common/css/common.css'
import style2 from './Login.css'
/**
* LoginForm
**/
class  _Login extends React.Component{
	constructor() {
		super();
	
		this.state = {
			message:""
		}
	}

	handleLogin = () => {
		var user = this.verifyLogin();
		if (!user) {
			this.setState({"message":"The user name / password enter does not match any user account. Please try again."});
			cm.dispatch({"type":"setLoginState", "data":"failed"})
			return;
		}
		if (user.role==="Provider") {
			cm.setPath(cm.routeData["ProviderDiagram"]); 
			cm.dispatch([{"type":"setUser", "data":user}]);
		} else {
			cm.setPath(cm.routeData["EnterpriseDiagram"]); 
			cm.dispatch([{"type":"setUser", "data":user},
				{"type":"setSelectedEnterpriseId", "data":user.company.id}]);
		}
		cm.dispatch({"type":"setLoginState", "data":"successful"})
		
	}
	
	verifyLogin = () => {
		var userName = this.userName.value;
		var pw = this.password.value;
		var userList = cm.getStoreValue("HeaderReducer", "userList")
		var res = undefined;
		for (var i=0; i<userList.length; i++) {
			var user = userList[i];
			if (userName===user.user && pw===user.password) {
				res = user;
				break;
			}
		}
		return res;
	}
	handleKeypress = (e) =>{
		if(e.key == 'Enter'){
			this.handleLogin()
		}
	}
	
	/**
	* render
	* @return {ReactElement} markup
	*/
	render(){
		
	//console.log("cm.enterpriseList="+cm.enterpriseList)
		
		return (
			<div style={{"height":"100vh"}} className="grad LoginContainer">
				<div className="header_logo">NetElastic</div>
				<div className="header_logo2">System</div>
				<center>
					<div className="LoginDiv">
						<div className="LoginHeader"><center><h3>User Login</h3></center>
						</div>
						
					            <div className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>
			    					<input name="email" defaultValue="enterprise" onKeyPress={(e)=>this.handleKeypress(e)}  type="text" tabIndex="1" placeholder="User Name" style={{"width":"400px"}} ref = {(input) => { this.userName = input; }} />
					            </div>
					            <div className="field"   style={{'margin':'20px','width':'450px'}}>
			    					<input name="password" defaultValue="ne123" onKeyPress={(e)=>this.handleKeypress(e)} type="password" tabIndex="2" placeholder="Password" style={{"width":"400px"}} ref = {(input) => { this.password = input; }} />
					            </div>
			    				<div ref="message" style={{"height":"90px", "width":"300px"}}>{this.state.message}
						            
					            </div>
			    				<button disabled={this.props.userList===undefined} onClick={this.handleLogin.bind(this)} style={{"marginTop":"20px", "marginLeft":"400px", "color":this.props.userList===undefined?"#999":"#000"}}>Log In</button>
			    				<div style={{"marginLeft":"20px"}}><a href="#">Forgot password</a></div>

	    			</div>
    			</center>
			</div>
		);
	}
}
const Login = connect(
		  store => {
			    return {
			    	userList: store.HeaderReducer.userList
			    };
			  }
			)(_Login);
export default Login
