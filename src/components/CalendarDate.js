import React, { Component } from 'react'
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import moment from 'moment';

export default class CalendarDatePicker extends Component {

  handleDateSelection(event) {
    console.log(event._d);
    console.log(event);
  }

  render() {
    return (
      <div>
        <Calendar onChange= { this.handleDateSelection }/>
      </div>
    )
  }
}
