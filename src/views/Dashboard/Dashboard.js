import React, { Component } from 'react';
import AuthComponent from '../../components/AuthComponent';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Button, CardTitle, CardText, Row, Col , CardBlock, CardHeader} from 'reactstrap';
import { loadChildActivites } from '../../actions';

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      activitiesArray: []
    }
  }

  componentDidMount() {
    this.props.loadChildActivites().then( (result) => {
      let activitiesArray = [];
      for (let k in result.response.entities.childActivities) {
        activitiesArray.push(result.response.entities.childActivities[k]);
      }
      this.setState({
        activitiesArray: activitiesArray
      })
    });
  }


  render() {
    return (
      <div className="animated fadeIn">
        <AuthComponent />
        <Row>
          <Col >
            <Card>
              <CardHeader>
                Children Activities
              </CardHeader>
              <CardBlock>
                <Card block>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </CardBlock>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    vehicleActivities: state.entities.vehicleActivities,
    childActivities: state.entities.childActivities,
  }
};

const dispatchToProps = (dispatch) => {
  return {
    loadChildActivites: () => dispatch(loadChildActivites()),
  }
};

export default connect(mapStateToProps, dispatchToProps)(withRouter(Dashboard));
