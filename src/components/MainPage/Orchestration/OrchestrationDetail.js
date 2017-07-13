import React, { Component } from 'react'
import {Accordion, Panel} from 'react-bootstrap'
import cm from '../../../common/CommunicationManager'
import Utils from '../../../common/Utils'
	
export default class OrchestrationDetail extends React.Component {

	  render() {
		var self = this;	
		let node = this.props.selectedNode;
		if (!node) {
			return null;
		}
		if (node.showETCD || node.showMaster) {
			var innerName;
			if (node.showMaster) {
				innerName = "Master"
			} else {
				innerName = "ETCD"
			}
		    return (
		    	<div style={{"margin":"8px"}}>
			    	<h4>{innerName} Details:</h4>
			    	
			    	<ul style={{"overflow":"auto", "height":Utils.screenH+"px"}}>
			    		{
			    			Object.keys(node[innerName].version).map((key, idx)=>{
			    				var value = node[innerName].version[key];
			    				if (Object.prototype.toString.call(value) !== '[object String]' && isNaN(value)) {
			    					value = JSON.stringify(value)
			    					return (
			    							<li key={idx}>{key}:<br/><textarea style={{"width":"200px"}}>{value}</textarea></li>
			    					)
			    				} else {
			    					if ((""+key+value).length>16) {
			    						return (
				    							<li key={idx}>{key}:<br/><textarea style={{"width":"200px"}}>{value}</textarea></li>
				    					)
			    					} else {
			    						return (
						    					<li key={idx}>{key}:{value}</li>
						    				)
			    					}
			    					
			    				}
			    				
			    			})
			    		}
			    	</ul>
			    </div>
		    );
		} else {
			if (node.properties===undefined) {
				return (
				    	<div style={{"margin":"8px"}}>
					    	<h4><a href="#">{node.Name}</a></h4>
					    </div>
				    );
			}
			let cc = []
			if (node.Children && node.Children.length>0) {
	    		for (var i=0; i<node.Children.length; i++) {
	    			cc.push(node.Children[i].Name)
	    		}
	    	}
		    return (
		    	<div style={{"margin":"8px"}}>
			    	<h4>Properties:</h4>
			    	<li>Id:{node.id}</li>
			    	<li>Name:{node.Name}</li>
			    	<ul style={{"overflow":"auto", "height":(Utils.screenH-110)+"px"}}>
			    		{
			    			Object.keys(node.properties).map((key, idx)=>{
			    				var value = node.properties[key];
			    				if (Object.prototype.toString.call(value) !== '[object String]' && isNaN(value)) {
			    					value = JSON.stringify(value)
			    					return (
			    							<li key={idx}>{key}:<br/><textarea style={{"width":"200px"}}>{value}</textarea></li>
			    					)
			    				} else {
			    					if ((""+key+value).length>16) {
			    						return (
				    							<li key={idx}>{key}:<br/><textarea style={{"width":"200px"}}>{value}</textarea></li>
				    					)
			    					} else {
			    						return (
						    					<li key={idx}>{key}:{value}</li>
						    				)
			    					}
			    					
			    				}
			    				
			    			})
			    		}
			    	</ul>
			    </div>
		    );
		  }
		}
		
	}

	