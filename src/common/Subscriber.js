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
import ReactDOM from 'react-dom'
import cs from '../common/CommunicationManager'

class Subscriber extends React.Component {
  constructor(props) {
    super(props);
    this.refList = [];
    var self = this;
    cs.subscribe(this.props.ActionType, function(options) {
    	
    	for (var i=0; i<self.refList.length; i++){
    		var elem = ReactDOM.findDOMNode(self.refs[self.refList[i]]);
    		if (elem.value!==undefined && self.props.setField===undefined) {
    			elem.value = options.data;
    		} else {
    			let setField = self.props.setField===undefined?"innerHTML":self.props.setField;
    			elem[setField] = options.data;
    		}
    	}
    	
    })
  }
  getId (pre) {
      var v = pre + new Date().valueOf();
      //console.info("v="+v)
      return v;
  }; 
  
  render() {
	  var self = this;
	  const _children = React.Children.map(this.props.children, child => {
		  let id = null;
		  let res = null;
		  if (child.ref) {
			  id = child.ref;
			  res = child;
		  } else {
			  id = self.getId("Sub_");
			  res = React.cloneElement(child, {
		    	  ref: id
		      })
		  }
		  self.refList.push(id);
	      return res;
	    });

	  return (<div>{_children}</div>);
  }  
}

export default Subscriber;

module.exports = Subscriber;