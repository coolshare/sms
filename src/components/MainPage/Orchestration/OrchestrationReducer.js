import Utils from '../../../common/Utils'
const OrchestrationReducer = (state = {'counter':[0, 0], 'selectedEnterprise':null, 'provider':null,'selectedTab':'Provider','OrchestrationData':{}, 'data':null}, action) => {
  switch (action.type) {
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
  	case 'setSelectedEnterprise':
        return Object.assign({}, state, {
        	selectedEnterprise: action.data
        })
  	case 'addEnterprise':
  		var data = Object.assign({}, state.provider);
  		var d = action.data;
  		data.Provider.nodes.push(d);
        return Object.assign({}, state, {
        	provider: data
        })
  	case 'addBranch':
  		var provider = Object.assign({}, state.provider);
  		var d = action.data;
  		provider.Enterprise[state.selectedEnterprise].nodes.push(d);
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
  		if (action.tab)
  		var d = action.data;
  		data.Enterprise[state.selectedEnterprise].nodes.push(d);
        return Object.assign({}, state, {
        	provider: data
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