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
			role:"Provider"
		}
	}
	
	componentDidMount() {
		cm.dispatch({"type":"/EnterpriseService/getAll", "options":{"response":(data)=>{
			cm.dispatch({"type":"setEnterpriseList", "data":data})
		}}})
	}
	handleLogin= () => {
		if (this.state.role==="Provider") {
			cm.dispatch([{"type":"pushPath", "action":cm.routeData["Orchestration"]}, {"type":"setUser", "data":{"user":this.userName.value, "password":this.password.value, "role":this.state.role, "company":{}}}]);
		} else {
			var list = this.company.value.split("|");
			cm.dispatch([{"type":"pushPath", "action":cm.routeData["Orchestration"]}, {"type":"setUser", "data":{"user":this.userName.value, "password":this.password.value, "role":this.state.role, "company":{"EnterpriseId":list[1], "BusinessName":list[0]}}}]);
		}
		
		
	}
	setRole = (e) => {
		this.setState(Object.assign({}, this.state, {
			role: e.target.value
        }))
	}
	handleCompany = () => {
		this.setState(Object.assign({}, this.state, {
			company: {"BusinessName":this.refs.company.value, "id":"123456"}
        }))
	}
	/**
	* render
	* @return {ReactElement} markup
	*/
	render(){
		if (this.props.enterpriseList===undefined) {
			return null;
		}
		var enterpriseList = this.props.enterpriseList.map((enterprise, idx)=>{
			return (<option key={idx} value={enterprise.BusinessName+"|"+enterprise.EnterpriseId}>{enterprise.BusinessName}</option>)
		})
		
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
			    				<div style={{"height":"90px"}}>
						            <div><label><input name="role" type="radio" onChange={(e) => this.setRole(e)}  checked={this.state.role==="Provider"} value="Provider" ref="provider" />As a provider admin</label><label style={{"marginLeft":"18px"}}><input type="radio" checked={this.state.role==="Enterprise"} name="role" value="Enterprise" ref="enterprise" onChange={(e) => this.setRole(e)} />As a enterprise admin</label></div>
						            {this.state.role==="Enterprise"?<div style={{"marginTop":"10px"}}>
						            <label>Company Name:
						            	<select type="text" onChange={this.handleCompany} ref = {(input) => { this.company = input; }}>
						            		{enterpriseList}	
						            	</select>
						             (just for testing)</label></div>:null}
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
const Login = connect(
		  store => {
			    return {
			    	enterpriseList: store.OrchestrationReducer.enterpriseList
			    };
			  }
			)(_Login);
export default Login
