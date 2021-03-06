import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import Page from './Page';
import Loader from '../components/Loader';
import { add as addErrors } from '../state/errors';
import api from '../api';

class Export extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      files: [],
    };

    this.loadFiles = this.loadFiles.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  componentDidMount() {
    this.loadFiles().catch(err => {
      this.props.addErrors(err);
    });
  }

  loadFiles() {
    this.setState({ loading: true });

    return api
      .exportList()
      .then(files => {
        this.setState({ files: files || [], loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
        throw err;
      });
  }

  onCreateClick(e) {
    e.preventDefault();

    return api
      .exportCreate()
      .then(this.loadFiles)
      .catch(err => {
        this.props.addErrors(err);
      });
  }

  render() {
    return (
      <Grid>
        <Row style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              onClick={this.onCreateClick}
              disabled={this.state.loading}
            >
              Create a new SQLite export
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>{this.filesList()}</Col>
        </Row>
      </Grid>
    );
  }

  filesList() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (!this.state.files.length) {
      return <p>No files to download</p>;
    }

    return (
      <ul>
        {this.state.files.map((f, i) => (
          <li key={i}>
            <button
              onClick={e => {
                e.preventDefault();
                api.exportDownload(f);
              }}
            >
              {f}
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { addErrors })(
  Page(Export, {
    className: 'export-page',
    titleFn: () => 'Export',
    showHeader: true,
  })
);
