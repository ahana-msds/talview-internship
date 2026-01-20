import React, { PureComponent } from "react";

class PureComponentDemo extends PureComponent {
    render() {
        // shallow comparison is done automatically
        return <div>pure count: {this.props.count}</div>;
    }
}

export default PureComponentDemo;
