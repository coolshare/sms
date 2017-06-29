/*
 Coolshare React PubSub - A package/service to provide
 publish/subscribe pattern for communication in React

 Copyright (C) 2017 Mark Qian <markqian@hotmail.com>


Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
import React from 'react';
import cs from '../common/CommunicationManager'

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
		  this.props.action.data = e.target.value;
	  }
	  
	  if (this.props.keyFilter!==undefined && this.props.keyFilter!==e.key) {
		  return;
	  }
	  if (this.props.setState!==undefined) {
		  this.props.action._type = "setState";
		  this.props.action._data = this.props.setState;
	  }
	  cs.dispatch(this.props.action);
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