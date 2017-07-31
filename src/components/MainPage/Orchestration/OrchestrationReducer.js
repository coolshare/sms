import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import Provider from '../../../common/models/Provider'

const OrchestrationReducer = (state = {'isEnterpriseInit':false, 'isProviderInit':false, 'enterpriseList':[],'currentLink':null, 'search':'', 'selectedBranchId':undefined, 'selectedEnterpriseId':undefined, 'provider':new Provider(),'selectedTab':'Provider','OrchestrationData':{}, 'data':null}, action) => {
  switch (action.type) {
  	case 'setIsProviderInit':
  	  cm.isProviderInit = true
      return Object.assign({}, state, {
    	  isProviderInit: cm.isProviderInit
      })
  	case 'setIsEnterpriseInit':
    	  cm.isProviderInit = true
        return Object.assign({}, state, {
      	  isEnterpriseInit: cm.isEnterpriseInit
        })
    case 'setEnterpriseList':
  		console.log("<<====== received all enterprise")
  		cm.enterpriseList = action.data
        return Object.assign({}, state, {
      	  enterpriseList: cm.enterpriseList
        })
  	case 'setSearch':
  	  cm.search = action.data
      return Object.assign({}, state, {
    	  search: cm.search
      })
    case 'setProvider':
      cm.provider = action.data;
      return Object.assign({}, state, {
    	  provider: cm.provider
      })
  	case 'setSelectedTab':
  		cm.selectedTab = action.data
        return Object.assign({}, state, {
      	  selectedTab: cm.selectedTab
        })
  	case 'setSelectedLink':
  		if (cm.selectedLink) {
  			cm.selectedLink.line.attr("stroke", "#D1D1D1").attr("stroke-width", "1px")	
  		}
  		if (action.data===cm.selectedLink) {
  			cm.selectedLink = undefined;
		} else {
			cm.selectedLink = action.data
		}	
  		if (cm.selectedLink) {
  			cm.selectedLink.line.attr("stroke", "#00F").attr("stroke-width", "2px")	
  		}
        return Object.assign({}, state, {
        	selectedLink: cm.selectedLink
        })
    case 'setSelectedBranchId':
  		if (cm.selectedBranchId) {
  			cm.nodeMap[cm.selectedBranchId].updateSelected(false); 			
  		}
  		var noDetails = action.noDetails
  		if (cm.selectedBranchId===action.data) {
  			cm.selectedBranchId = cm.selectedBranch = undefined;
  			noDetails = true
  		} else {
  			cm.selectedBranchId = action.data;
  	  		cm.selectedBranch = cm.nodeMap[cm.selectedBranchId]
  		}
  		
  		if (cm.selectedBranch) {
  			cm.selectedBranch.updateSelected(true);
  			action.asyncDispatch({"type":"setSelectedLink", "data":undefined});
  		}
  		
        return Object.assign({}, state, {
        	selectedBranchId: cm.selectedBranchId,
        	noDetails:noDetails
        })
  	case 'setSelectedEnterpriseId':
  		if (cm.selectedEnterprise) {
  			var dd = cm.selectedEnterprise
  			cm.selectedEnterprise.updateSelected(false);
  		}
  		var noDetails = action.noDetails
  		if (cm.selectedEnterpriseId===action.data) {
  			cm.selectedEnterpriseId = cm.selectedEnterprise = undefined;
  			noDetails = true
  		} else {
  			cm.selectedEnterpriseId = action.data;
  	  		cm.selectedEnterprise = cm.nodeMap[cm.selectedEnterpriseId]
  	  	var dd = cm.selectedEnterprise
  		}
  		
  		if (cm.selectedEnterprise) {
  			cm.selectedEnterprise.updateSelected(true);
  			
  		}
  		console.log("cm.selectedEnterpriseId="+cm.selectedEnterpriseId)
        return Object.assign({}, state, {
        	selectedEnterpriseId: cm.selectedEnterpriseId,
        	noDetails:noDetails
        })
  	case 'setSelectedEnterpriseDirty':
  		var  mm = cm.selectedEnterprise.updateSelected
  		cm.selectedEnterprise.dirty = true;
  		cm.selectedEnterprise = Object.assign({}, cm.selectedEnterprise);
  		cm.selectedEnterprise.updateSelected = mm

        return Object.assign({}, state, {
        	selectedEnterprise: cm.selectedEnterprise
        })
  	case 'setProviderDirty':
  		state.provider.dirty = true;
  		cm.provider = Object.assign({}, state.provider, {
      	  dirty: true
        })
  		return Object.assign({}, state, {
      	  provider: cm.provider
        })
  	case 'saveCurrentLink':
  		cm.currentLink = [action.source, action.target]
        return Object.assign({}, state, {
        	currentLink: cm.currentLink
        })
    default:
      return state
  }
 
  
}

export default OrchestrationReducer