import React, { Component } from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'

	
class _OrchestrationFloatMenu extends React.Component {
	handleProvider() {
		cm.dispatch({"type":"setSelectedTab", "data":"Provider"})

	}
	handleEnterprise() {
		cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})

	}
	
	handleAdd() {
		alert("handleAdd")
	}
	handleRemove() {
		alert("handleRemove")
	}
	render() {
		var self = this;	
		var selectedTab = this.props.selectedTab
		return (
		    	<div style={{"fontSize":"70%", "position":"absolute", "top":"90px", "left":"320px", "margin":"8px", "width":"200px", "height":"200px", "zIndex":"999"}} >
			    	{
			    		this.props.selectedTab==="Provider"?
					    	<ul>
					    		<li className="headLink">By Name</li>
					    		<li className="headLink">By Region</li>
					    	</ul>
				    	:this.props.selectedTab==="Enterprise"?
					    	<ul>
					    		<li className="headLink">By Problem</li>
					    		<li className="headLink">By Region</li>
					    		<li className="headLink">By Services</li>
					    	</ul>
					    :null
			    	}
			    </div>
		    );
		
	}

	
}

const OrchestrationFloatMenu = connect(
		  store => {
			    return {
			    	selectedTab: store.OrchestrationReducer.selectedTab
			    };
			  }
			)(_OrchestrationFloatMenu);
export default OrchestrationFloatMenu	