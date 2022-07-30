+'use strict';
import Timer from "./timer.js";

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    return <Timer initialMinute = {0} initialSeconds= {5} endCallback={()=>{console.log("end time")}}/>
    return (<button onClick={()=>{this.setState({liked: true})}}> click <Timer /> </button>)
  }
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(<LikeButton />);