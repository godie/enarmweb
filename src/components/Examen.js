import React, {Component} from 'react';
import Pregunta from './Pregunta';
import Caso from './Caso';
import { FBComments, FBCommentsCount } from 'facebook-plugins';
import EnarmUtil from '../modules/EnarmUtil';


class Examen extends Component {

  constructor(props){
    super(props);
    var clinicCaseId = EnarmUtil.getCategory(this.props);
    var comment_url = "http://enarm.godieboy.com/#/caso/"+clinicCaseId;
    this.state = {
      clinicCaseId:clinicCaseId,
      comment_url:comment_url,
      width: 300
    }
  }
  componentDidMount() {
    this.updateDimensions();
  }

  componentWillReceiveProps(nextProps) {
    var clinicCaseId = EnarmUtil.getCategory(nextProps);
    var comment_url = "http://enarm.godieboy.com/#/caso/"+clinicCaseId;
    //console.log(nextProps);
    this.setState({
      clinicCaseId: clinicCaseId,
      comment_url: comment_url});
  }


  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
    if(window.innerWidth < 500) {
      this.setState({ width: 300, height: 102 });
    } else {
      let update_width  = window.innerWidth-500;
      let update_height = Math.round(update_width/4.4);
      this.setState({ width: update_width, height: update_height });
    }
  }

  render(){
    return(
      <div className="s12 m12 l6 white">
        <Caso clinicCaseId={this.state.clinicCaseId} router={this.props.router} />
        <div className="row">
         <div className="col s12 m10 l8">
          <FBComments appId="401225480247747"
             href={this.state.comment_url}
             width={this.state.width}
             numPosts={10}
             locale="es_LA" />
          </div>
          </div>
      </div>
    );
  }

}

export default Examen;
