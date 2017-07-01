import React from 'react/addons';
import Header from './Header';
import cs from '../../common/CommunicationManager'

describe("Header - testing with test utilities", () => {
  beforeEach(function() {
    this.path = cs.routeData["Home"];

    let { TestUtils } = React.addons;

    this.TestUtils = TestUtils;
    this.component = TestUtils.renderIntoDocument(<Header path={this.path} />);
  });

  it("renders the path", function() {
    let pathContainer = this.TestUtils.findRenderedDOMComponentWithClass(this.component, "headerPathContainer");
    expect(pathContainer.children.length).toEqual(1);

    let pathElem = this.TestUtils.findRenderedDOMComponentWithClass(pathContainer, "headerPathElem");
    expect(pathElem.length).toEqual(1);
    
    let pathElemDivider = this.TestUtils.findRenderedDOMComponentWithClass(pathElem, "headerPathElemDivider");
    expect(pathElemDivider.length).toEqual(0);
  });  
});