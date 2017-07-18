import React, { Component } from 'react'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import BranchForm from './BranchForm'
	
class _OrchestrationBranchDetail extends React.Component {

	 render() {
		var self = this;	
		let id = this.props.selectedBranch;
		if (!id) {
			return null;
		}
		var selectedEnterprise = cm.getStoreValue("OrchestrationReducer", "provider").enterpriseMap[cm.getStoreValue("OrchestrationReducer", "selectedEnterprise")];
		var selectedBranch = selectedEnterprise.branchMap[id];
		return (
		    <div>
		    	<BranchForm selectedBranch={selectedBranch.data} title="Branch Info"/>
		    </div>
		);
	}
}
const OrchestrationBranchDetail = connect(
		  store => {
			    return {
			    	selectedBranch: store.OrchestrationReducer.selectedBranch
			    };
			  }
			)(_OrchestrationBranchDetail);
export default OrchestrationBranchDetail
	