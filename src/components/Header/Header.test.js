import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import { Provider } from 'react-redux'
import Header from './Header';
import { createStore, applyMiddleware } from 'redux'
import ReducerManager from '../ReducerManager'
import cm from '../../common/CommunicationManager'
import {logger, currentAction, asyncDispatchMiddleware, callbackMiddleware} from '../CommonMiddleware'
import { shallow } from 'enzyme';

let store = createStore(ReducerManager, applyMiddleware(logger, currentAction, asyncDispatchMiddleware, callbackMiddleware));
cm.init(store);

let sm = require("../../common/ServiceManager").default
sm.init();


describe("Header", () => {
  var self;
  beforeEach(function() {
	self = this;
    this.path = cm.routeData["Home"];

    this.TestUtils = TestUtils;
    
    this.component = TestUtils.renderIntoDocument(<Provider store={store}><Header path={this.path} /></Provider>);
  });

  it("renders the path", function() {
	  console.log("enter it self.component="+self.component)
    let pathContainer = self.TestUtils.findRenderedDOMComponentWithClass(self.component, "headerPathContainer");
	  console.log("in it pathContainer="+pathContainer)
    //console.log("line32 pathContainer="+pathContainer.innerHTML)
    //expect(pathContainer.children.length).toEqual(1);
    //console.log("line34")
    //let pathElem = self.TestUtils.findRenderedDOMComponentWithClass(self.component, "headerPathElem");
    //expect(pathElem.length).toEqual(1);
    
    let pathElemSpan = self.TestUtils.scryRenderedDOMComponentsWithClass(self.component, "pathElemSpan");
	  //expect(pathElemSpan).to.have.length.of(1);
	  console.log("in it pathElemSpan="+pathElemSpan+"**")
    //expect(pathElemDivider.length).toEqual(0);
  }); 
  it ("shadow test", function() {
	  const p = shallow(<Provider store={store}><Header className="header" path={self.path} /></Provider>)
	  let header = self.TestUtils.scryRenderedDOMComponentsWithClass(p, "header");
	  // Using prop to retrieve the columns property
	  expect(header.prop('path')).to.eql(self.path);
  })
});