import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux'
//import cs from '../services/CommunicationService'
//import { browserHistory } from 'react-router';
/**
*
*/
class _Header extends React.Component{

	componentDidMount() {
		//debugger
		//cs.store.dispatch({'type':'switchTopLink', 'pageId':'main'});
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		let pathElem = this.props.path.map((p, idx)=> {
			let dd = "";
			if (idx>0) {
				dd = ">"
			}
			return (
					<span key={idx}><span>{dd}</span> <span>{p.name}</span></span>
			)
		})
		return (
			
			<div id="header"   style={{'height':'70px', 'margin':'5px', 'border':'1px solid #e1e1e1'}}>
				<div style={{'height':'50px', 'backgroundColor':'#1b83b1'}}></div>
				<div style={{'height':'20px', 'backgroundColor':'#e6eaec'}}>
					{pathElem}
				</div>
      		</div>
		)
	}
}
const Header = connect(
		  store => {
			    return {
			    	path:store.HeaderReducer.path
			    };
			  }
			)(_Header);
export default Header
