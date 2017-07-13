import React, { Component } from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import style from './Orchestration.css'

	
class _OrchestrationHeader extends React.Component {
	handleProvider() {
		cm.dispatch({"type":"setSelectedTab", "data":"Provider"})

	}
	handleEnterprise() {
		cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})

	}
	
	handleAdd() {
		cm.dispatch({"type":"_popup_", "data":"add"+this.props.selectedTab})
	}
	handleRemove() {
		alert("handleRemove")
	}
	  render() {
		var self = this;	
		var selectedTab = this.props.selectedTab
		return (
		    	<div style={{"margin":"8px"}}>
			    	<form>
			    		<input placeholder="Search"/><span className={selectedTab==="Provider"?"selectedTab":"unselectedTab"} style={{"marginLeft":"20px", "marginRight":"20px"}} onClick={this.handleProvider.bind(this)}>Provider</span>
			    		<span className={selectedTab==="Enterprise"?"selectedTab":"unselectedTab"} style={{"marginRight":"20px"}} onClick={this.handleEnterprise.bind(this)}>Enterprise</span>
			    		<span style={{"float":"right", "fontSize":"70%"}}><span className="headLink" style={{"marginRight":"20px"}} onClick={this.handleAdd.bind(this)}>Add {selectedTab==="Provider"?"Enterprise":selectedTab==="Enterprise"?"Branch":""}</span><span className="headLink" onClick={this.handleRemove.bind(this)}>Remove {selectedTab==="Provider"?"Enterprise":selectedTab==="Enterprise"?"Branch":""}</span></span>
			    	</form>
			    </div>
		    );
		
	}

	
}
			    		
const OrchestrationHeader = connect(
		  store => {
			    return {
			    	selectedTab: store.OrchestrationReducer.selectedTab
			    };
			  }
			)(_OrchestrationHeader);
export default OrchestrationHeader				    		