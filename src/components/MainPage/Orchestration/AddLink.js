import React, { Component } from 'react';
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Branch from '../../../common/models/Branch'

class _AddLink extends React.Component {
	constructor() {
		super();
		this.fields = {};
	}

	componentDidMount() {
		
	}

	handleOK = (e) => {
		var self = this;
		e.preventDefault();
		//var data = {};
		
		//for (var f in this.fields) {
		//	data[f] = this.fields[f].value			
		//}
		//data.id = new Date().valueOf();
		cm.dispatch({"type":"/EnterpriseLinkService/create", "params":[self.src.id, self.tar.id], "options":{"response":(data)=>{
			cm.dispatch({"type":"ClosePopup"})
			//cm.dispatch({"type":"addBranchLink", "data":{"source":self.src.id, "target":self.tar.id}})
		}}})
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	render() {
		var self = this;

		this.src = cm.selectedEnterprise.branchMap[this.props.currentLink[0]]
		this.tar = cm.selectedEnterprise.branchMap[this.props.currentLink[1]]
	    return (
				
			<div style={{"minHeight":Utils.screenH+"px", "minWidth":"700px"}}>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"200%"}}>Add A Connection</div>
		      		<form onSubmit={ (e) => this.handleOK(e) } ref="AddLinkForm">
		      			<div ref="src" style={{"float":"left", "width":"45%", "marginRight":"20px", "border":"1px solid #000", "borderRadius":"10px", "padding":"20px"}}>
		      				<h4>Source</h4>
				      		<label className="field"  style={{'margin':'20px','width':'200px', 'paddingTop':'40px'}}>Branch Name:
								<input name="BranchName1" readOnly value={self.src.data.BusinessName} ref={(input)=>{this.fields["BranchName1"] = input}}  type="text" tabIndex="1" placeholder="Branch Name" style={{"width":"200px"}} />
				            </label>
				            <label className="field"   style={{'margin':'20px','width':'200px'}}>Contact Name:
								<input name="ContactName1" readOnly value={self.src.data.ContactName} ref={(input)=>{this.fields["ContactName1"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"200px"}} />
				            </label>
						</div>
						<div ref="tar" style={{"float":"left", "width":"45%", "border":"1px solid #000", "borderRadius":"10px", "padding":"20px"}}>
		      				<h4>Target</h4>
				      		<label className="field"  style={{'margin':'20px','width':'200px', 'paddingTop':'40px'}}>Branch Name:
								<input name="BranchName2" readOnly value={self.tar.data.BusinessName} ref={(input)=>{this.fields["BranchName2"] = input}}  type="text" tabIndex="1" placeholder="Branch Name" style={{"width":"200px"}} />
				            </label>
				            <label className="field"   style={{'margin':'20px','width':'200px'}}>Contact Name:
								<input name="ContactName2" readOnly value={self.tar.data.ContactName} ref={(input)=>{this.fields["ContactName2"] = input}} type="text" tabIndex="2" placeholder="Contact Name" style={{"width":"200px"}} />
				            </label>
						</div>
						<br style={{"clean":"both"}}/>
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

const AddLink = connect(
		  store => {
			    return {
			    	currentLink: store.OrchestrationReducer.currentLink
			    };
			  }
			)(_AddLink);
export default AddLink