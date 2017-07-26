import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
import Provider from '../../../common/models/Provider'

const AdminReducer = (state = {'groupList':[], 'selectedGroupId': null, 'currentPage':'UserAdmin'}, action) => {
  switch (action.type) {
  	
  	case 'loadAdminUser':
  		return Object.assign({}, state, {
        	currentPage: action.data
        })
        
  	case 'loadAdminGroup':
  		return Object.assign({}, state, {
        	currentPage: action.data
        })
    
  	case 'loadSelectedRow':
  		return Object.assign({}, state, {
  			selectedRow: action.data
        })
  	case 'setSelectedGroup':
  		return Object.assign({}, state, {
  			selectedGroupId: action.data
        })
  	case 'setGroupList':
  		return Object.assign({}, state, {
  			groupList: action.data
        })    
    
    
    default:
      return state
  }
}  
export default AdminReducer