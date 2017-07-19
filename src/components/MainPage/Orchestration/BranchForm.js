import React, { Component } from 'react';
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Branch from '../../../common/models/Branch'
import Form from '../../../common/Form'

class _BranchForm extends Form {

	handleOK = (e) => {
		e.preventDefault();
		var data = this.collectFields(e);
		cm.dispatch({"type":"ClosePopup"})
		setTimeout(function() {
			cm.dispatch({"type":"addBranch", "data":new Branch(data, 20, 100, 100+60*cm.getStoreValue("OrchestrationReducer", "counter")[1] , 35, 0, "#E1E1E1", -8, -8, 16, 16)})
		}, 100)
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	componentDidUpdate = () => {
		if (this.props.isNew===undefined) {
			this.load(this.props.branch)
		}
	}
	render() {
		var branch = this.props.isNew?{}:this.props.branch
	    return (
	    	<form onSubmit={ (e) => this.handleOK(e) } ref="AddenterpriseForm">
	      		<label className="field"  style={{'margin':'10px','width':'450px'}}>Business Name:
					<input name="BusinessName" defaultValue={branch.BusinessName} ref={(input)=>{this.fields["BusinessName"] = input}}  type="text" tabIndex="1" placeholder="BusinessName Name" style={{"width":"200px"}} />
	            </label>
	            <label className="field"   style={{'margin':'10px','width':'450px'}}>Contact Name:
					<input name="ContactName" defaultValue={branch.ContactName} ref={(input)=>{this.fields["ContactName"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"200px"}} />
	            </label>
					<label className="field"  style={{'margin':'10px','width':'450px'}}>Phone:
					<input name="Phone" defaultValue={branch.Phone} ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" placeholder="Phone" style={{"width":"200px"}}/>
	            </label>
	            <label className="field"   style={{'margin':'10px','width':'450px'}}>Email:
					<input name="Email" defaultValue={branch.Email} ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" placeholder="Email" style={{"width":"200px"}}/>
	            </label>
					<label className="field"  style={{'margin':'10px','width':'450px'}}>Alert Method:
					<input name="AlertMethod" defaultValue={branch.AlertMethod} ref={(input)=>{this.fields["AlertMethod"] = input}}  type="text" tabIndex="1" placeholder="Alert Method" style={{"width":"200px"}}/>
	            </label>
	            <label className="field" style={{'margin':'10px','width':'450px'}}>Address:
					<input name="Address" defaultValue={branch.Address}  ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" placeholder="Address" style={{"width":"200px"}} />
	            </label>
				<label className="field" style={{'margin':'10px','width':'450px'}}>Icon:
					<input name="Icon" ref={(input)=>{this.fields["Icon"] = input}}  type="file" tabIndex="2" placeholder="Icon" style={{"width":"200px"}} />
	            </label>
				<div>
					<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"10px", "float":"right"}}>Cancel</button>
					<button type="submit" style={{"marginTop":"10px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
				</div>
      		</form>
	
	    )
	}
}
const BranchForm = connect(
		  store => {
			    var provider = store.OrchestrationReducer.provider;
			    var id = store.OrchestrationReducer.selectedEnterprise;
			    var enterprise = provider.enterpriseMap[id];
			    id = store.OrchestrationReducer.selectedBranch
			    if (id===null) {
			    	branch:{}
			    } else {
			    	return {
				    	branch: enterprise.branchMap[id].data
				    };
			    }
			    
			  }
			)(_BranchForm);
export default BranchForm
