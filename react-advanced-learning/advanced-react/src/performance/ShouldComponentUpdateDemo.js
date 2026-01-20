import React, { Component } from "react";

class ShouldComponentUpdateDemo extends Component {
    shouldComponentUpdate(nextProps) {
        // prevents re-render if value has not changed
        return nextProps.count !== this.props.count;
    }

    render() {
        console.log("rendering child");
        return <div>count: {this.props.count}</div>;
    }
}

export default ShouldComponentUpdateDemo;
