import React from "react";
import ReactDOM from "react-dom";

class Demo extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      demoTxt: "just a test demo",
    };
  }

  render() {
    const { demoTxt } = this.state;
    let demoPage = (<div className="demo-wrap">
      {demoTxt}
    </div>);
    return demoPage;
  }
}
ReactDOM.render(<Demo />, document.getElementById("demo"));
