import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Branch from '../../../common/models/Branch'

export default class AddBranch extends React.Component {
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
	render() {
	    return (
				
			<div style={{"minHeight":Utils.screenH+"px"}}>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"200%"}}>Add Branch</div>
		      		<form onSubmit={ (e) => this.handleOK(e) } ref="AddBranchForm">
			      		<div className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>
							<input name="BranchName" ref={(input)=>{this.fields["BranchName"] = input}}  type="text" tabIndex="1" placeholder="Branch Name" style={{"width":"400px"}} />
			            </div>
			            <div className="field"   style={{'margin':'20px','width':'450px'}}>
							<input name="ContactName" ref={(input)=>{this.fields["ContactName"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"400px"}} />
			            </div>
							<div className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>
							<input name="Phone" ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" placeholder="Phone" style={{"width":"400px"}}/>
			            </div>
			            <div className="field"   style={{'margin':'20px','width':'450px'}}>
							<input name="Email" ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" placeholder="Email" style={{"width":"400px"}}/>
			            </div>
							<div className="field"  style={{'margin':'20px','width':'450px', 'paddingTop':'40px'}}>
							<input name="AlertMethod" ref={(input)=>{this.fields["AlertMethod"] = input}}  type="text" tabIndex="1" placeholder="Alert Method" style={{"width":"400px"}}/>
			            </div>
			            <div className="field"   style={{'margin':'20px','width':'450px'}}>
							<input name="Address" ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" placeholder="Address" style={{"width":"400px"}} />
			            </div>
						<div className="field"   style={{'margin':'20px','width':'450px'}}>
							<input name="Icon" ref={(input)=>{this.fields["Icon"] = input}}  type="file" tabIndex="2" placeholder="Icon" style={{"width":"400px"}} />
			            </div>
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

