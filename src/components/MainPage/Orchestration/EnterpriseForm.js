import React, { Component } from 'react';
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Enterprise from '../../../common/models/Enterprise'
import Form from '../../../common/Form'

class _EnterpriseForm extends Form {

	handleOK = (e) => {
		e.preventDefault();
		var data = this.collectFields(e);
		cm.dispatch({"type":"/EnterpriseService/create", "params":[data],"options":{"response":(data2)=>{
			cm.dispatch({"type":"ClosePopup"})

		}}});
		cm.dispatch({"type":"ClosePopup"})		
		
	}
	
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	
	componentDidUpdate = () => {
		if (this.props.isNew===undefined) {
			this.load(this.props.enterprise)
		}
		
	}
	render() {
		var enterprise = this.props.isNew?{}:this.props.enterprise
	    return (
	    	<form onSubmit={ (e) => this.handleOK(e) } ref="AddenterpriseForm">
	      		<label className="field"  style={{'margin':'10px','width':'450px'}}>Business Name:
					<input name="BusinessName" defaultValue={enterprise.BusinessName} ref={(input)=>{this.fields["BusinessName"] = input}}  type="text" tabIndex="1"/>
	            </label>
	            <label className="field"   style={{'margin':'10px','width':'450px'}}>Contact Name:
					<input name="ContactName" defaultValue={enterprise.ContactName} ref={(input)=>{this.fields["ContactName"] = input}} type="text" tabIndex="2" />
	            </label>
					<label className="field"  style={{'margin':'10px','width':'450px'}}>Phone:
					<input name="Phone" defaultValue={enterprise.Phone} ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" style={{"width":"200px"}}/>
	            </label>
	            <label className="field"   style={{'margin':'10px','width':'450px'}}>Email:
					<input name="Email" defaultValue={enterprise.Email} ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" style={{"width":"200px"}}/>
	            </label>
					<label className="field"  style={{'margin':'10px','width':'450px'}}>Alert Method:
					<input name="AlertMethod" defaultValue={enterprise.AlertMethod} ref={(input)=>{this.fields["AlertMethod"] = input}}  type="text" tabIndex="1" style={{"width":"200px"}}/>
	            </label>
	            <label className="field" style={{'margin':'10px','width':'450px'}}>Address:
					<input name="Address" defaultValue={enterprise.Address}  ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" style={{"width":"200px"}} />
	            </label>
				<label className="field" style={{'margin':'10px','width':'450px'}}>Icon:
					<input name="Icon" defaultValue={enterprise.Icon} ref={(input)=>{this.fields["Icon"] = input}}  type="file" tabIndex="2" style={{"width":"200px"}} />
	            </label>
				<div>
					<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"10px", "float":"right"}}>Cancel</button>
					<button type="submit" style={{"marginTop":"10px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
				</div>
      		</form>
	
	    )
	}
}
const EnterpriseForm = connect(
		  store => {
			    var provider = store.OrchestrationReducer.provider;
			    var id = store.OrchestrationReducer.selectedEnterpriseId
			    if (id===null) {
			    	enterprise:{}
			    } else {
			    	return {
				    	enterprise: provider.enterpriseMap[id].data
				    };
			    }
			    
			  }
			)(_EnterpriseForm);
export default EnterpriseForm
