import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'

const OrchestrationReducer = (state = {'currentLink':null, 'search':'', 'counter':[0, 0], 'selectedBranch':null, 'selectedEnterprise':null, 'provider':null,'selectedTab':'Provider','OrchestrationData':{}, 'data':null}, action) => {
  switch (action.type) {
  	case 'setSearch':
      return Object.assign({}, state, {
    	  search: action.data
      })
  	case 'setCounter':
        return Object.assign({}, state, {
      	  counter: action.data
        })
    case 'setProvider':
      return Object.assign({}, state, {
    	  provider: action.data
      })
  	case 'setSelectedTab':
        return Object.assign({}, state, {
      	  selectedTab: action.data
        })
  	case 'setSelectedBranch':
        return Object.assign({}, state, {
        	selectedBranch: action.data,
        	noDetails:action.noDetails
        })
  	case 'setSelectedEnterprise':
  		cm.selectedEnterprise = action.data;
        return Object.assign({}, state, {
        	selectedEnterprise: action.data,
        	noDetails:action.noDetails
        })
  	case 'addEnterprise':
  		var provider = Object.assign({}, state.provider);
  		var id = action.data.data.id;
  		provider.enterpriseMap[id] = action.data;
  		provider.nodes.push(action.data);
  		provider.links.push({"source":provider.internetForProvider, "target":action.data})
        return Object.assign({}, state, {
        	provider: provider
        })
  	case 'addBranch':
  		var provider = Object.assign({}, state.provider);
  		var enterprise = provider.enterpriseMap[state.selectedEnterprise];
  		enterprise.branchMap[action.data.data.id] = action.data;
  		enterprise.nodes.push(action.data);
  		enterprise.links.push({"source":enterprise.internetForEnterprise, "target":action.data})
        return Object.assign({}, state, {
        	provider: provider
        })
  	case 'removeEnterprise':
  		var provider = Object.assign({}, state.provider);
  		var id = state.selectedEnterprise;
  		delete provider.enterpriseMap[id];
  		var foundIndex = -1;
  		for (var i=0; i<provider.nodes.length; i++) {
  			var enterprise = provider.nodes[i]
  			if (enterprise.id === id) {
  				foundIndex = i;
  				break;
  			}
  		}
  		if (foundIndex<0) {
  			return state;
  		}
  		provider.nodes.splice(foundIndex, 1);
  		
  		var deleteList = []
  		for (var i=0; i<provider.links.length; i++) {
  			var link = provider.links[i];
  			if (link.source.id===id || link.target.id===id) {
  				deleteList.push(i);
  			}
  		}
  		
  		for (var i=deleteList.length-1; i>-1; i--) {
  			provider.links.splice(deleteList[i], 1);
  		}
        return Object.assign({}, state, {
        	provider: provider
        })
  	case 'removeBranch':
  		var provider = Object.assign({}, state.provider);
  		var enterprise = provider.enterpriseMap[state.selectedEnterprise];
  		var id = state.selectedBranch;
  		delete enterprise.branchMap[id];
  		var foundIndex = -1;
  		for (var i=0; i<enterprise.nodes.length; i++) {
  			var branch = enterprise.nodes[i]
  			if (branch.id === id) {
  				foundIndex = i;
  				break;
  			}
  		}
  		if (foundIndex<0) {
  			return state;
  		}
  		enterprise.nodes.splice(foundIndex, 1);
  		
  		
  		var deleteList = []
  		for (var i=0; i<enterprise.links.length; i++) {
  			var link = enterprise.links[i];
  			if (link.source.id===id || link.target.id===id) {
  				deleteList.push(i);
  			}
  		}
  		
  		for (var i=deleteList.length-1; i>-1; i--) {
  			enterprise.links.splice(deleteList[i], 1);
  		}
  		
        return Object.assign({}, state, {
        	provider: provider
        })
  	case 'addEnterpriseLink':
  		var provider = Object.assign({}, state.provider);
  		var src = provider.enterpriseMap[action.data.source];
  		var tar = provider.enterpriseMap[action.data.target];
  		provider.links.push({"source":src, "target":tar})
        return Object.assign({}, state, {
        	provider: provider
        })
  	case 'addBranchLink':
  		var provider = Object.assign({}, state.provider);
  		var enterprise = provider.enterpriseMap[state.selectedEnterprise]
  		var src = enterprise.branchMap[action.data.source];
  		var tar = enterprise.branchMap[action.data.target];
  		enterprise.links.push({"source":src, "target":tar})
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