import Utils from '../../../common/Utils'
const OrchestrationReducer = (state = {'selectedEnterprise':null, 'tabData':{},'selectedTab':'Provider','OrchestrationData':{}, 'data':null}, action) => {
  switch (action.type) {
  	case 'setTabData':
      return Object.assign({}, state, {
    	  tabData: action.data
      })
  	case 'setSelectedTab':
        return Object.assign({}, state, {
      	  selectedTab: action.data
        })
  	case 'setSelectedEnterprise':
        return Object.assign({}, state, {
        	selectedEnterprise: action.data
        })
    case 'expandOrchestrationNode':
      return Object.assign({}, state, {
    	  data: action.data
      })
    case 'addNode':
    	let orchestrationData3 = Object.assign({}, state.OrchestrationData);
    	let nodes3 = findNodes(orchestrationData3, true)
    	
    	nodes3[0].Children.push(action.data.node2)
    	nodes3[0].ExpandState = 1;
    	return Object.assign({}, state, {
    		OrchestrationData: orchestrationData3
        })
    case 'addLink':
    	let orchestrationData = Object.assign({}, state.OrchestrationData);
    	let nodes = findNodes(orchestrationData)
    	
    	nodes[0].Children.push(nodes[1])
    	nodes[0].ExpandState = 1;
    	return Object.assign({}, state, {
    		OrchestrationData: orchestrationData
        })
    case 'removeLink':
    	let orchestrationData2 = Object.assign({}, state.OrchestrationData);
    	let nodes2 = findNodes(orchestrationData2)
    	
    	let childId = -1;
    	for (let i=0; i<nodes2[0].Children.length; i++) {
    		if (nodes2[0].Children[i].id===nodes2[1].id) {
    			childId = i;
    			break;
    		}
    	}
    	if (childId<0) {
    		console.log("Error: can not find the relation")
    		return state;
    	}
    	nodes2[0].Children.splice(childId, 1);
    	return Object.assign({}, state, {
    		OrchestrationData: orchestrationData2
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