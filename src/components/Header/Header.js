import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux'
import cs from '../../services/CommunicationService'

//import { browserHistory } from 'react-router';
/**
*
*/
class _Header extends React.Component{

	componentDidMount() {
		/*var url = window.location.href;
		var list = url.split("//")
		list = list[1].split("/")
		var path = [];
		//path.push(cs.routeData["Home"]);
		for (var i=1; i<list.length; i++) {
			var p = cs.routeData[list[i]];
			if (p===undefined) {
				break;
			}
			path.push(p)
		}*/
		cs.store.dispatch({'type':'setPath', 'path':this.props.path});
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
			if (idx>this.props.path.length-2) {
				return (
						<span key={idx}><span style={{"color":"#000", "marginLeft":"5px", "marginRight":"5px"}}>{dd}</span><span style={{"cursor":"default","color":"#00"}}>{p.label}</span></span>
				)
			} else {
				return (
						<span key={idx}><span style={{"color":"#000", "marginLeft":"5px", "marginRight":"5px"}}>{dd}</span><span onClick={()=>cs.dispatch({'type':'goPath', 'target':p.label})} style={{"cursor":"pointer","color":"blue"}}>{p.label}</span></span>
				)
			}
			
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
