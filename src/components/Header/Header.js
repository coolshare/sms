import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux'
import { browserHistory } from 'react-router';
import cm from '../../common/CommunicationManager'
import sm from '../../common/ServiceManager';
import style from './Header.css'
/**
*
*/
class _Header extends React.Component{
	handleLink = (id, e)=> {
		e.preventDefault();
		browserHistory.push('/'+id);
		cm.dispatch([{'type':'switchTopLink', 'id':id},{"type":"refreshOrchestration"}]);
		
	}
	componentDidMount() {
		let path = this.props.path;
		if (path.length===0) {
			var p = this.reconstructPath();
			if (p!==null) {
				path = p;
			}
		}
		cm.dispatch({'type':'setPath', 'path':path});
	}
	handleLogout() {
		cm.dispatch({'type':'clearBrowserHistory'});
	}
	
	reconstructPath() {
		var url = window.location.href;
		//console.log("url="+url)
		var list = url.split("//")
		if (list[1]===undefined) {
			return null;
		}
		list = list[1].split("/")
		var path = [];
		path.push(cm.routeData["Home"]);
		for (var i=1; i<list.length; i++) {
			var p = cm.routeData[list[i]];
			if (list[i]=="Home") {
				continue;
			}
			if (p===undefined) {
				break;
			}
			path.push(p)
		}
		return path;
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		
		if (cm.user===undefined) {
			cm.dispatch({'type':'clearBrowserHistory'});
			return null
			
		}
		let pathElem = this.props.path.map((p, idx)=> {
			let dd = "";
			if (idx>0) {
				dd = ">"
			}
			if (idx>this.props.path.length-2) {
				return (
						<span key={idx} className="headerPathElem"><span className="headerPathElemDivider" style={{"color":"#000", "marginLeft":"5px", "marginRight":"5px"}}>{dd}</span><span ref="pathElemSpan" className="pathElemSpan" style={{"cursor":"default","color":"#000"}}>{p.label}</span></span>
				)
			} else {
				return (
						<span key={idx} className="headerPathElem"><span className="headerPathElemDivider" style={{"color":"#000", "marginLeft":"5px", "marginRight":"5px"}}>{dd}</span><span className="pathElemSpan" onClick={()=>cm.dispatch({'type':'goPath', 'target':p.label})} style={{"cursor":"pointer","color":"blue"}}>{p.label}</span></span>
				)
			}
			
		})

		return (
			
			<div id="header"   style={{'height':'70px','border':'1px solid #e1e1e1', "backgroundColor":"#1b83b1", "color":"#AAA"}}>
				<div style={{"width":"20%", "height":"50px", "float":"left"}}><span style={{"marginLeft":"20px", "fontSize":"200%", "color":"#FFF"}}>netElastic</span></div>
				<div style={{"width":"60%", "height":"50px", "float":"left", 'paddingTop':'20px'}}>
		      		<span><a href="#" style={{"textCecoration": "none"}} onClick={(evt) => this.handleLink("Dashboard", evt)} className={this.props.currentLink=="MainRouteContainer"?"selectedTopLink":"unselectedTopLink"}>Dashboard</a></span>
		      		<span style={{"marginLeft":"40px"}}><a href="#" style={{"textDecoration": "none"}} onClick={(evt) => this.handleLink(cm.user.role+"Diagram", evt)} className={this.props.currentLink===(cm.user.role+"Diagram")?"selectedTopLink":"unselectedTopLink"}>Orchestration</a></span>
		      		<span style={{"marginLeft":"40px"}}><a href="#" style={{"textDecoration": "none"}} onClick={(evt) => this.handleLink("Admin", evt)} className={this.props.currentLink=="Admin"?"selectedTopLink":"unselectedTopLink"}>Adminstration</a></span>
		      	</div>
		      	<div style={{"width":"20%", "height":"50px", "float":"right", 'paddingTop':'5px', "paddingRight":"7px"}}>
		      		<span>{this.props.user.user}</span><span style={{"marginLeft":"10px", "textDecoration": "underline", "cursor":"pointer", "float":"right"}} onClick={this.handleLogout.bind(this)}>Logout</span>
		      	</div>
		      	<br style={{"clear":"both"}}/>
				<div className="headerPathContainer" style={{"height":"20px", "backgroundColor":"#e6eaec"}}>
					{pathElem}
				</div>
      		</div>
		)
	}
}
const Header = connect(
		  store => {
			    return {
			    	path:store.HeaderReducer.path,
			    	user:store.HeaderReducer.user,
			    	currentLink: store.HeaderReducer.currentLink
			    };
			  }
			)(_Header);
export default Header
