import React, { Component } from 'react'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import BranchForm from './BranchForm'
	
class _OrchestrationBranchDetail extends React.Component {

	 render() {
		var self = this;	
		let id = this.props.selectedBranchId;
		if (!id) {
			return null;
		}
		var selectedBranch = cm.selectedEnterprise.branchMap[id];
		if (selectedBranch===undefined) {
			return null;
		}
		return (
		    <div>
		    	<BranchForm branch={selectedBranch.data} title="Branch Info"/>
		    </div>
		);
	}
}
const OrchestrationBranchDetail = connect(
		  store => {
			    return {
			    	selectedBranchId: store.OrchestrationReducer.selectedBranchId
			    };
			  }
			)(_OrchestrationBranchDetail);
export default OrchestrationBranchDetail
	