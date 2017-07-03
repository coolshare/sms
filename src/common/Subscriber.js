
import React from 'react';
import ReactDOM from 'react-dom'
import cm from '../common/CommunicationManager'

class Subscriber extends React.Component {
  constructor(props) {
    super(props);
    this.refList = [];
    var self = this;
    cm.subscribe(this.props.ActionType, function(options) {
    	
    	for (var i=0; i<self.refList.length; i++){
    		var elem = ReactDOM.findDOMNode(self.refs[self.refList[i]]);
    		if (elem.value!==undefined && self.props.setField===undefined) {
    			elem.value = options.elemData;
    		} else {
    			let setField = self.props.setField===undefined?"innerHTML":self.props.setField;
    			elem[setField] = options.elemData;
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