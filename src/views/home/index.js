import React, { Component } from 'react'
import { request } from '../../lib';

export default class Index extends Component {
  componentDidMount() {
    this.getAllMovies();
  }
  getAllMovies = () => {
    request({
      method: 'get',
      url: '/movies/all'
    }).then(res => {
      this.setState({
        dataSource: res
      })
    }).catch(() => {
      this.setState({
        dataSource: []
      })
    })
  }
  render() {
    return (
      <div>
        home
      </div>
    )
  }
}
