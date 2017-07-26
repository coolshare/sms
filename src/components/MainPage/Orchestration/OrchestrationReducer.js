import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import Provider from '../../../common/models/Provider'

const OrchestrationReducer = (state = {'isInit':false, 'selectedEnterprise':null, 'enterpriseList':[],'currentLink':null, 'search':'', 'selectedBranchId':null, 'selectedEnterpriseId':null, 'provider':new Provider(),'selectedTab':'Provider','OrchestrationData':{}, 'data':null}, action) => {
  switch (action.type) {
  	case 'setIsInit':
      return Object.assign({}, state, {
    	  isInit: true
      })
  	case 'setEnterpriseList':
        return Object.assign({}, state, {
      	  enterpriseList: action.data
        })
  	case 'setSearch':
      return Object.assign({}, state, {
    	  search: action.data
      })
    case 'setProvider':
      return Object.assign({}, state, {
    	  provider: action.data
      })
  	case 'setSelectedTab':
        return Object.assign({}, state, {
      	  selectedTab: action.data
        })
  	case 'setSelectedBranchId':
  		if (cm.selectedBranchId) {
  			cm.nodeMap[cm.selectedBranchId].updateSelected(false);
  			if (cm.selectedBranchId===action.data) {
  				cm.selectedBranchId = null;
  				return Object.assign({}, state, {
  		        	selectedBranchId: null,
  		        	noDetails:action.noDetails,
  		        	selectedBranch: null
  		        })
  			}
  		}
  		cm.selectedBranchId = action.data;
  		cm.selectedBranch = cm.nodeMap[cm.selectedBranchId]
  		cm.selectedBranch.updateSelected(true);
        return Object.assign({}, state, {
        	selectedBranchId: action.data,
        	noDetails:action.noDetails,
        	selectedBranch: cm.selectedBranch
        })
  	case 'setSelectedEnterpriseId':
  		console.log("cm.selectedEnterpriseId="+cm.selectedEnterpriseId)
  		var pre = cm.nodeMap[cm.selectedEnterpriseId];
  		if (pre) {	
  			pre.updateSelected(false);
  		}
  		cm.selectedEnterpriseId = action.data;
  		cm.selectedEnterprise = cm.nodeMap[cm.selectedEnterpriseId]
  		if (cm.selectedEnterprise) {
  			cm.selectedEnterprise.updateSelected(true);
  		}
  		
        return Object.assign({}, state, {
        	selectedEnterpriseId: action.data,
        	noDetails:action.noDetails,
        	selectedEnterprise: cm.selectedEnterprise
        })
  	case 'setSelectedEnterpriseDirty':
  		cm.selectedEnterprise.dirty = true;
  		var selectedEnterprise = Object.assign({}, cm.selectedEnterprise, {dirty:true});
        return Object.assign({}, state, {
        	selectedEnterprise: selectedEnterprise
        })
  	case 'setSelectedProviderDirty':
  		state.provider.dirty = true;
  		var provider = Object.assign({}, state.provider, {
      	  dirty: true
        })
  		return Object.assign({}, state, {
      	  provider: provider
        })
  	case 'saveCurrentLink':
        return Object.assign({}, state, {
        	currentLink: [action.source, action.target]
        })
    default:
      return state
  }
  function findNodes(orchestrationData, pNodeOnly) {
	  
  	let pNode = null;
  	for (let i=0; i<orchestrationData.Clusters.length; i++) {
  		pNode = Utils.findNode(action.data.node1.id, orchestrationData.Clusters[i]);
  		if (pNode!==null) {
  			break;
  		}
  	}
  	if (pNodeOnly) {
  		if (pNode===null) {
  			console.log("Node is missing when ...")
  			return null;
  		}
  		return [pNode, null]
  	}
  	let cNode = null;
  	
  	for (let i=0; i<orchestrationData.Clusters.length; i++) {
  		cNode = Utils.findNode(action.data.node2.id, orchestrationData.Clusters[i]);
  		if (cNode!==null) {
  			break;
  		}
  	}
  	if (pNode===null || cNode===null) {
		console.log("Node is missing when addLink")
		return null;
	}
  	return [pNode, cNode]
  }
  
}

export default OrchestrationReducer