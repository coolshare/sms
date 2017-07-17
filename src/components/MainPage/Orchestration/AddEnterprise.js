import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Enterprise from '../../../common/models/Enterprise'

export default class AddEnterprise extends React.Component {
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
			cm.dispatch({"type":"addEnterprise", "data":new Enterprise(data, 20, 100+60*cm.getStoreValue("OrchestrationReducer", "counter")[0], 100 , 35, 0, "#E1E1E1", -8, -8, 16, 16)})
		}, 100)
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	render() {
	    return (
				
			<div style={{"minHeight":Utils.screenH+"px"}}>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"200%"}}>Add Enterprise</div>
		      		<form onSubmit={ (e) => this.handleOK(e) } ref="AddEnterpriseForm">
			      		<label className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>Business Name:
							<input name="BusinessName" ref={(input)=>{this.fields["BusinessName"] = input}}  type="text" tabIndex="1" placeholder="Business Name" style={{"width":"200px"}} />
			            </label>
			            <label className="field"   style={{'margin':'20px','width':'450px'}}>Contact Name:
							<input name="ContactName" ref={(input)=>{this.fields["ContactName"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"200px"}} />
			            </label>
							<label className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>Phone:
							<input name="Phone" ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" placeholder="Phone" style={{"width":"200px"}}/>
			            </label>
			            <label className="field"   style={{'margin':'20px','width':'450px'}}>Email:
							<input name="Email" ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" placeholder="Email" style={{"width":"200px"}}/>
			            </label>
							<label className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>Alert Method:
							<input name="AlertMethod" ref={(input)=>{this.fields["AlertMethod"] = input}}  type="text" tabIndex="1" placeholder="Alert Method" style={{"width":"200px"}}/>
			            </label>
			            <label className="field"   style={{'margin':'20px','width':'450px'}}>Address:
							<input name="Address" ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" placeholder="Address" style={{"width":"200px"}} />
			            </label>
						<label className="field"   style={{'margin':'20px','width':'450px'}}>Icon:
							<input name="Icon" ref={(input)=>{this.fields["Icon"] = input}}  type="file" tabIndex="2" placeholder="Icon" style={{"width":"200px"}} />
			            </label>
						<div>
							<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"20px", "float":"right"}}>Cancel</button>
							<button type="submit" style={{"marginTop":"20px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
						</div>
		      		</form>
			    </div>
			</div>

	    	
	    )
	}
}

