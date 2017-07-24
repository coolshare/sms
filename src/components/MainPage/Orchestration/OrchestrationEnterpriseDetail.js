import React, { Component } from 'react'
import cm from '../../../common/CommunicationManager'
import {connect} from 'react-redux'
import EnterpriseForm from './EnterpriseForm'
	
class _OrchestrationEnterpriseDetail extends React.Component {

	 render() {
		var self = this;	
		let id = this.props.selectedEnterpriseId;
		if (!id) {
			return null;
		}
		var selectedEnterprise = this.props.provider.enterpriseMap[id];
		

		return (
			    <div>
			    	<EnterpriseForm enterprise={selectedEnterprise.data} title="Branch Info"/>
			    </div>
			);
	}
}
const OrchestrationEnterpriseDetail = connect(
		  store => {
			    return {
			    	selectedEnterpriseId: store.OrchestrationReducer.selectedEnterpriseId,
			    	provider: store.OrchestrationReducer.provider
			    };
			  }
			)(_OrchestrationEnterpriseDetail);
export default OrchestrationEnterpriseDetail

	