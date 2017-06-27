import React, { Component } from 'react'
import {connect} from 'react-redux'
import PubsubComponent from './PubsubComponent'
import RemoteService from '../../../../services/RemoteService'
import cs from '../../../../services/CommunicationService'

class _PubsubContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		var self = this;
	}
	
	render() {
		
		if (this.props.items===null) {
			return null;
		}
		
	    return (
	      < PubsubComponent test1={this.props.test1} /> 
	    )
	  }
}	
const PubsubContainer = connect(
		  store => {
			  
			    return {
			    	test1: store.PatternsRightPaneReducer.test1
			    };
			  }
			)(_PubsubContainer);
export default PubsubContainer