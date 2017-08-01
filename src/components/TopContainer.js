import React from 'react';
import cm from '../common/CommunicationManager'
import Header from './Header/Header'
import Spinner from 'react-spinkit'

const defaultUserList = [{"user":"provider", "password":"ne123", "role":"Provider", "company":{"EnterpriseId":"61", "BusinessName":"Netelastic"}},
	{"user":"enterprise", "password":"ne123", "role":"Enterprise", "company":{"EnterpriseId":"61", "BusinessName":"Netelastic"}}]


export default class TopContainer extends React.Component{
	componentDidMount() {
		
		cm.progress1 = this.refs.progress1;
		cm.progress2 = this.refs.progress2;
		console.log("======>fetch all enterprise")
		
		cm.dispatch({"type":"setUserList", "data":defaultUserList})
		//cm.dispatch([{"type":"updateMainContainerSize", "data":{"w":this.topContainer.clientWidth, "h":this.topContainer.clientHeight}}, {"type":"/EnterpriseService/getAll", "options":{"forwardType":"setEnterpriseList"}}])
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
	
		return (			
			<div id="top2" id="topContainer" ref = {(input) => { this.topContainer = input; }} style={{"width":"100%", "height":"100vh"}}>
				{this.props.children.type.displayName.indexOf("Login")<0?<Header/>:null}
				{this.props.children}
				<div ref="progress1" style={{'display':'none', 'cursor':'wait', 'zIndex': '9998', 'top': '0px', 'left': '0px', 'position': 'absolute', 'background':"#232323", 'opacity':'0.5', "width":"100%", "height":"100vh"}}></div>
				<div ref="progress2" style={{'display':'none', 'zIndex': '9999', 'top': '50%', 'left': '50%', 'position': 'absolute'}} ><Spinner name="circle" /></div>
	      	</div>

		)
	}
}