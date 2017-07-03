import React from 'react';
import cm from '../common/CommunicationManager'

class Dispatcher extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    if (props.classes) {
    	var cn = [];
    	for (var c in props.classes) {
    		cn.push(c);
    	}
    	this.ppp.className = cn.join(" ");
    }
    this.event = "Click";
    if (props.event) {
    	this.event = props.event;
    }
    this.dispatch = this.dispatch.bind(this)
  }
  
  dispatch (e) {
	  if (e.target.nodeName!=="BUTTON") {
		  this.props.action.elemData = e.target.value;
	  }
	  
	  if (this.props.keyFilter!==undefined && this.props.keyFilter!==e.key) {
		  return;
	  }
	  if (this.props.setState!==undefined) {
		  this.props.action._type = "setState";
		  this.props.action._data = this.props.setState;
	  }
	  cm.dispatch(this.props.action);
  }
  
  render() {
	  var self = this;
	  var notFound = false;
	  var children = React.Children.map(this.props.children, function (c, index) {		  
		  var ppp = Object.assign({}, c.props);
		  ppp["on"+self.event] = self.dispatch;
		  var ccc = React.DOM[c.type];
		  if (ccc) {
			  return ccc(ppp);
		  } else {
			  notFound = true;
			  return c;
		  }
		  
      });
	  if (notFound) {
		  var ppp = {};
		  if (self.props.classes) {
	    	var cn = [];
	    	for (var c in self.props.classes) {
	    		cn.push(c);
	    	}
	    	ppp.className = cn.join(" ");
	      }

	      if (self.props.event) {
	    	ppp["on"+self.props.event] = function() {
	    		self.dispatch();
	    	}
	      } else {
	    	ppp["onClick"] = self.dispatch;
	      }
		  return <div { ...ppp } >{self.props.children}</div>;
	  } else {
		  return (
				  <div>
				  {children}
				  </div>
		    );
	  }
	  
  }
}

export default Dispatcher;

module.exports = Dispatcher;