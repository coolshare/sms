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
		cm.dispatch([{"type":"setSelectedTab", "data":"Provider"},{"type":"refreshOrchestration"}])

	}
	handleEnterprise() {
		cm.dispatch([{"type":"setSelectedTab", "data":"Enterprise"},{"type":"refreshOrchestration"}])

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
		    	  		cm.dispatch({"type":"/EnterpriseService/remove", "params":[cm.getStoreValue("OrchestrationReducer", "selectedEnterpriseId")], "options":{"response":(data)=>{
				  			cm.dispatch([{"type":"setSelectedEnterpriseId", "data":undefined}, {"type":"setProviderDirty"}, {"type":"refreshOrchestration"}])
		    	  		}}})
			  			
			  		} else if (this.props.selectedTab==="Enterprise") {
			  			if (cm.selectedBranch) {
			  				cm.dispatch({"type":"/BranchService/remove", "params":[cm.getStoreValue("OrchestrationReducer", "selectedBranchId")], "options":{"response":(data)=>{
					  			cm.dispatch([{"type":"setSelectedBranchId", "data":undefined}, {"type":"setSelectedEnterpriseDirty"},{"type":"refreshOrchestration"}])
			    	  		}}})
			  			} else if (cm.selectedLink) {
			  				//var link = cm.selectedLink
			  				cm.dispatch({"type":"/BranchLinkService/remove", "params":[cm.selectedLink.source.id, cm.selectedLink.target.id], "options":{"response":(data)=>{
					  			cm.dispatch([{"type":"setSelectedBranchId", "data":undefined}, {"type":"setSelectedEnterpriseDirty"},{"type":"refreshOrchestration"}])
			    	  		}}})
			  			}
			  			
			  			
			  		}
		    	  	cm.dispatch({"type":"hideNodeDetails"})
		      },    // Action after Confirm 
		      onCancel: () => {}     // Action after Cancel 
		    })
		    
		
	}
	handleChange = (e) => {
		
		cm.dispatch([{"type":"setSearch", "data":e.target.value},{"type":"refreshOrchestration"}])

	}
	  render() {
		var self = this;	
		var selectedTab = this.props.selectedTab
		var buttonName = [];
		if (selectedTab==="Provider") {
			buttonName = ["Add Enterprise", "Remove Enterprise"]
		} else {
			if (cm.selectedBranch) {
				buttonName = ["Add Branch", "Remove Branch"]
			} else if (cm.selectedLink) {
				buttonName = ["Add Branch", "Remove Link"]
			} else {
				buttonName = ["Add Branch", "Remove"]
			}
			
		}
		
		return (
		    	<div style={{"margin":"8px"}}>
		    		<input placeholder="Search" ref={(input)=>this.searchField = input} onChange={(e)=>this.handleChange(e)} style={{"marginRight":"20px"}}/>
		    		{this.props.user.role==="Provider"?<span className={selectedTab==="Provider"?"selectedTab":"unselectedTab"} style={{"marginRight":"20px"}} onClick={this.handleProvider.bind(this)}>Provider</span>:null}
		    		{this.props.selectedEnterpriseId===undefined?<span className="disabled" style={{"marginRight":"20px"}}>Enterprise</span>:<span className={selectedTab==="Enterprise"?"selectedTab":"unselectedTab"} style={{"marginRight":"20px"}} onClick={this.handleEnterprise.bind(this)}>Enterprise</span>}
		    		<span style={{"float":"right", "fontSize":"70%", "marginRight":"20px", "textDecoration":"underline"}}>
		    			<span className="headLink" style={{"marginRight":"20px"}} onClick={this.handleAdd.bind(this)}>{buttonName[0]}</span>
		    			{this.props.selectedTab==="Provider" && this.props.selectedEnterpriseId!==undefined || this.props.selectedTab==="Enterprise" && (this.props.selectedBranchId || cm.selectedLink)?<span className="headLink" onClick={this.handleRemove.bind(this)}>{buttonName[1]}</span>:<span className="disabled" >{buttonName[1]}</span>}
		    		</span>
			    </div>
		    );
		
	}

	
}
			    		
const OrchestrationHeader = connect(
		  store => {
			    return {
			    	selectedTab: store.OrchestrationReducer.selectedTab,
			    	selectedBranchId: store.OrchestrationReducer.selectedBranchId,
			    	selectedEnterpriseId: store.OrchestrationReducer.selectedEnterpriseId,
			    	user: store.HeaderReducer.user,
			    	selectedLink: store.OrchestrationReducer.selectedLink
			    };
			  }
			)(_OrchestrationHeader);
export default OrchestrationHeader				    		