import React, { Component } from 'react';
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import Utils from '../../../common/Utils'
import Branch from '../../../common/models/Branch'
import AddLinkBGP from './AddLinkBGP'
import AddLinkOSPF from './AddLinkOSPF'
import AddLinkStatic from './AddLinkStatic'

class _AddLink extends React.Component {
	constructor() {
		super();
		this.state = {type:"Static"}
	}


	handleOK = (e) => {
		var self = this;
		e.preventDefault();
		//var data = {};
		
		//for (var f in this.fields) {
		//	data[f] = this.fields[f].value			
		//}
		//data.id = new Date().valueOf();
		cm.dispatch({"type":"/BranchLinkService/create", "params":[self.src.id, self.tar.id], "options":{"response":(data)=>{
			cm.dispatch({"type":"setSelectedEnterpriseDirty"});
			cm.dispatch({"type":"ClosePopup"})
			//cm.dispatch({"type":"addBranchLink", "data":{"source":self.src.id, "target":self.tar.id}})
		}}})
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	
	handleTypeChange = () => {
		this.setState({"type":this.refs.typeSelect.value})
	}

	render() {
		var self = this;
		
		cm.selectedEnterprise = cm.provider.enterpriseMap[cm.selectedEnterpriseId]
		var dd = cm.selectedEnterprise
		this.src = cm.selectedEnterprise.branchMap[this.props.currentLink[0]]
		this.tar = cm.	selectedEnterprise.branchMap[this.props.currentLink[1]]
	    return (
				
			<div style={{"minHeight":Utils.screenH+"px", "minWidth":"700px"}}>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"150%"}}>Add A Connection between {this.src.label} and {this.tar.label}</div>
		      		<form onSubmit={ (e) => this.handleOK(e) } ref="AddLinkForm">
		      			<div>
		      				<select defaultValue={this.state.type} ref="typeSelect" onChange={this.handleTypeChange.bind(this)}>
		      					<option value="BGP">BGP</option>
		      					<option value="OSPF">OSPF</option>
		      					<option value="Static">Static</option>
		      				</select>
		      				{this.state.type==="BGP"?<AddlinkBGP/>:this.state.type==="OSPF"?<AddLinkOSPF/>:this.state.type==="Static"?<AddLinkStatic/>:null}
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