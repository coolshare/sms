import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Branch from '../../../common/models/Branch'

export default class BranchForm extends React.Component {
	constructor() {
		super();
		this.fields = {};
	}

	componentDidMount() {
		
	}

	handleOK = (e) => {
		e.preventDefault();
		var data = {};
		
		for (var f in this.fields) {
			data[f] = this.fields[f].value			
		}
		data.id = new Date().valueOf();
		cm.dispatch({"type":"ClosePopup"})
		setTimeout(function() {
			cm.dispatch({"type":"addBranch", "data":new Branch(data, 20, 100, 100+60*cm.getStoreValue("OrchestrationReducer", "counter")[1] , 35, 0, "#E1E1E1", -8, -8, 16, 16)})
		}, 100)
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	handleChange = () => {
		
	}
	render() {
		var branch = this.props.branch
		if (branch===undefined) {
			return null;
		}
	    return (
				
	      		<form onSubmit={ (e) => this.handleOK(e) } ref="AddBranchForm">
		      		<label className="field"  style={{'margin':'10px','width':'450px'}}>Branch Name:
						<input name="BusinessName" value={branch.BusinessName} onChange={this.handleChange} ref={(input)=>{this.fields["BusinessName"] = input}}  type="text" tabIndex="1" placeholder="Branch Name" style={{"width":"200px"}} />
		            </label>
		            <label className="field"   style={{'margin':'10px','width':'450px'}}>Contact Name:
						<input name="ContactName" value={branch.ContactName} onChange={this.handleChange} ref={(input)=>{this.fields["ContactName"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"200px"}} />
		            </label>
						<label className="field"  style={{'margin':'10px','width':'450px'}}>Phone:
						<input name="Phone" value={branch.Phone} onChange={this.handleChange} ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" placeholder="Phone" style={{"width":"200px"}}/>
		            </label>
		            <label className="field"   style={{'margin':'10px','width':'450px'}}>Email:
						<input name="Email" value={branch.Email} onChange={this.handleChange} ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" placeholder="Email" style={{"width":"200px"}}/>
		            </label>
						<label className="field"  style={{'margin':'10px','width':'450px'}}>Alert Method:
						<input name="AlertMethod" value={branch.AlertMethod} onChange={this.handleChange} ref={(input)=>{this.fields["AlertMethod"] = input}}  type="text" tabIndex="1" placeholder="Alert Method" style={{"width":"200px"}}/>
		            </label>
		            <label className="field"   style={{'margin':'10px','width':'450px'}}>Address:
						<input name="Address" value={branch.Address} onChange={this.handleChange} ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" placeholder="Address" style={{"width":"200px"}} />
		            </label>
					<label className="field"   style={{'margin':'10px','width':'450px'}}>Icon:
						<input name="Icon" value={branch.Icon} onChange={this.handleChange} ref={(input)=>{this.fields["Icon"] = input}}  type="file" tabIndex="2" placeholder="Icon" style={{"width":"200px"}} />
		            </label>
					<div>
						<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"10px", "float":"right"}}>Cancel</button>
						<button type="submit" style={{"marginTop":"10px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
					</div>
	      		</form>

	    )
	}
}

