import React from 'react';
import {connect} from 'react-redux'
import cs from '../../services/CommunicationService'
import RemoteService from '../../services/RemoteService'
import Footer from './Footer';
/**
*
*/
class _AboutPattern extends React.Component{

	componentDidMount(tabId) {
		let self = this;
		RemoteService.fatchThroughProxy("https://raw.githubusercontent.com/coolshare/ReactReduxPattern/master/README.md", {"callback":function(data) {
			self.refs.aboutPattern.innerHTML = data;
		}})
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div style={{"height":"500px", "overflow":"auto"}}>	
				<pre ref="aboutPattern">
					{this.props.aboutPattern===undefined?"":this.props.aboutPattern}
				</pre>	
      		</div>
		)
	}
}

const AboutPattern = connect(
		  store => {
			    return {
			    	aboutPattern: store.MainContainerReducer.aboutPattern
			    };
			  }
			)(_AboutPattern);
export default AboutPattern