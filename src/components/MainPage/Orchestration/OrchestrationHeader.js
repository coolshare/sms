import React, { Component } from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import style from './Orchestration.css'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert'; // Import 
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css 
	
class _OrchestrationHeader extends React.Component {
	handleProvider() {
		cm.dispatch({"type":"setSelectedTab", "data":"Provider"})

	}
	handleEnterprise() {
		cm.dispatch({"type":"setSelectedTab", "data":"Enterprise"})

	}
	
	handleAdd() {
		
		var name = this.props.selectedTab==="Provider"?"AddEnterprise":this.props.selectedTab==="Enterprise"?"AddBranch":null;
		if (name!==null) {
			cm.popup(cm.routeData[name].component, name)
		}
		
	}
	handleRemove() {
		confirmAlert({
		      title: 'Confirm to delete',                        // Title dialog 
		      message: 'Do you want to delete the selected item?',               // Message dialog        // Custom UI or Component 
		      confirmLabel: 'Confirm',                           // Text button confirm 
		      cancelLabel: 'Cancel',                             // Text button cancel 
		      onConfirm: () => {
		    	  	if (this.props.selectedTab==="Provider") {
			  			cm.dispatch({"type":"removeEnterprise"})
			  			cm.dispatch({"type":"setSelectedEnterprise"})
			  		} else if (this.props.selectedTab==="Enterprise") {
			  			cm.dispatch({"type":"removeBranch"})
			  			cm.dispatch({"type":"setSelectedBranch"})
			  		}
		    	  	cm.dispatch({"type":"hideNodeDetails"})
		      },    // Action after Confirm 
		      onCancel: () => {}     // Action after Cancel 
		    })
		    
		
	}
	handleChange = (e) => {
		cm.dispatch({"type":"setSearch", "data":e.target.value})

	}
	  render() {
		var self = this;	
		var selectedTab = this.props.selectedTab
		var buttonName = [];
		if (selectedTab==="Provider") {
			buttonName = ["Add Provider", "Remove Provider"]
		} else {
			buttonName = ["Add Branch", "Remove Branch"]
		}
		
		return (
		    	<div style={{"margin":"8px"}}>
		    		<input placeholder="Search" ref={(input)=>this.searchField = input} onChange={(e)=>this.handleChange(e)}/><span className={selectedTab==="Provider"?"selectedTab":"unselectedTab"} style={{"marginLeft":"20px", "marginRight":"20px"}} onClick={this.handleProvider.bind(this)}>Provider</span>
		    		{this.props.selectedEnterprise===null?<span className="disabled" style={{"marginRight":"20px"}}>Enterprise</span>:<span className={selectedTab==="Enterprise"?"selectedTab":"unselectedTab"} style={{"marginRight":"20px"}} onClick={this.handleEnterprise.bind(this)}>Enterprise</span>}
		    		<span style={{"float":"right", "fontSize":"70%", "marginRight":"20px", "textDecoration":"underline"}}>
		    			<span className="headLink" style={{"marginRight":"20px"}} onClick={this.handleAdd.bind(this)}>{buttonName[0]}</span>
		    			{this.props.selectedTab==="Provider" && this.props.selectedEnterprise!==null || this.props.selectedTab==="Enterprise" && this.props.selectedBranch!==null?<span className="headLink" onClick={this.handleRemove.bind(this)}>{buttonName[1]}</span>:<span className="disabled" >{buttonName[1]}</span>}
		    		</span>
			    </div>
		    );
		
	}

	
}
			    		
const OrchestrationHeader = connect(
		  store => {
			    return {
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedBranch: store.OrchestrationReducer.selectedBranch,
			    	selectedEnterprise: store.OrchestrationReducer.selectedEnterprise
			    };
			  }
			)(_OrchestrationHeader);
export default OrchestrationHeader				    		