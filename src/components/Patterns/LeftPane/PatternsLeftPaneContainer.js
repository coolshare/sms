import React from 'react';
import PatternsLeftPaneComponent from './PatternsLeftPaneComponent'
import {connect} from 'react-redux'

class _PatternsLeftPaneContainer extends React.Component {
	constructor(props) {
		super(props);
		this.data = {
			    id: 'Patterns',
			    name: 'React Patterns',
			    children: [{
			        id: 'Container',
			        name: 'Container/Component',
			        children: [{
			    	        id: 'Photo',
			    	        name: 'Photo Player'
			    	    }, {
			    	        id: 'Video',
			    	        name: 'Video Player'
			    	    }]
			    	}, {
			        id: 'Popup Pattern',
			        name: 'Popup Pattern'
			    },{
			        id: 'Pubsub Pattern',
			        name: 'Pubsub Pattern'
			    }]
			};
	}
	
	render() {
	    return (
	      < PatternsLeftPaneComponent data={this.data} currentPage = {this.props.currentPage}
	        /> 
	    )
	  }
}
const PatternsLeftPaneContainer = connect(
		  store => {
			  
			    return {
			    	currentPage: store.PatternsRightPaneReducer.currentPage
			    };
			  }
			)(_PatternsLeftPaneContainer);
export default PatternsLeftPaneContainer