import React from 'react';
import classNames from 'classnames';
import InfiniteTree from 'react-infinite-tree';
import 'react-infinite-tree/dist/react-infinite-tree.css';
import cs from '../../../services/CommunicationService'
import HousingInfo from '../../MainPage/FormTable/HousingInfo/HousingInfo'

export default class PatternsLeftPane extends React.Component {
    tree = null;

    componentDidMount() {
        this.tree.loadData(this.props.data);
        // Select the first node
        if (this.props.currentPage) {
        	var ch = this.tree.getChildNodes()[0].getChildren();
        	for (let i=0; i<ch.length; i++) {
        		var n = ch[i];
        		if (n.name===this.props.currentPage) {
        			this.tree.selectNode(n);
        		}
        	}
        } else {
        	this.tree.selectNode(this.tree.getChildNodes()[0].getChildren()[3]);
        }
        
    }
    render() {

        return (
            <div style={{"width":"300px", "border-right": "solid 1px black"}}>
                <InfiniteTree
                    ref={(c) => {if (c!==null) this.tree = c.tree;}}
                    autoOpen={true}
                    loadNodes={(parentNode, done) => {
                        const suffix = parentNode.id.replace(/(\w)+/, '');
                        const nodes = [
                            {
                                id: 'node1' + suffix,
                                name: 'Node 1'
                            },
                            {
                                id: 'node2' + suffix,
                                name: 'Node 2'
                            }
                        ];
                        setTimeout(() => {
                            done(null, nodes);
                        }, 1000);
                    }}
                    rowRenderer={(node, treeOptions) => {
                        const { id, name, loadOnDemand = false, children, state, props = {} } = node;
                        const droppable = treeOptions.droppable;
                        const { depth, open, path, total, selected = false } = state;
                        const more = node.hasChildren();

                        return (
                            <div
                                className={classNames(
                                    'infinite-tree-item',
                                    { 'infinite-tree-selected': selected }
                                )}
                                data-id={id}
                                droppable={droppable}
                            >
                                <div
                                    className="infinite-tree-node"
                                    style={{ marginLeft: depth * 18 }}
                                >
                                    {!more && loadOnDemand &&
                                        <a className={classNames(treeOptions.togglerClass, 'infinite-tree-closed')}>►</a>
                                    }
                                    {more && open &&
                                        <a className={classNames(treeOptions.togglerClass)}>▼</a>
                                    }
                                    {more && !open &&
                                        <a className={classNames(treeOptions.togglerClass, 'infinite-tree-closed')}>►</a>
                                    }
                                    <span className="infinite-tree-title">{name}</span>
                                </div>
                            </div>
                        );
                    }}
                    selectable={true}
                    shouldSelectNode={(node) => {
                        if (!node || (node.name === this.props.currentPage)) {
                            return true; // Prevent from deselecting the current node
                        }
                        return false;
                    }}
                    onClick={(event) => {
                        // click event
                        const target = event.target || event.srcElement; // IE8
                        console.log('click:', target);
                        var type = event.target.innerText;
                        if (type==="Popup Pattern") {
                        	cs.popup(HousingInfo, "HousingInfo");
                        } else {
                        	cs.dispatch({"type":"switchPatternPage", "id":type})
                        }
                        	
                        	
                        
                    }}
                    onDoubleClick={(event) => {
                        // dblclick event
                    }}
                    onKeyDown={(event) => {
                        // keydown event
                    }}
                    onKeyUp={(event) => {
                        // keyup event
                    }}
                    onOpenNode={(node) => {
                        console.log('open node:', node);
                    }}
                    onCloseNode={(node) => {
                        console.log('close node:', node);
                    }}
                    onSelectNode={(node) => {
                        console.log('select node:', node);
                    }}
                    onClusterWillChange={() => {
                    }}
                    onClusterDidChange={() => {
                    }}
                    onContentWillUpdate={() => {
                    }}
                    onContentDidUpdate={() => {
                    }}
                />
            </div>
        );
    }
}

