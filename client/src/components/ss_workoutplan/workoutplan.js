import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';

const localizer = momentLocalizer(moment);

class MyCalendar extends React.Component {
  state = {
    holidaysList: [], // Replace with fetched holiday data
    absentiesList: [
      {
        id: 1,
        username: "Meeting with stakeholders to discuss the quarterly performance review and future project goals. This meeting will cover financial reports, team achievements, potential roadblocks, and strategies to improve overall productivity and efficiency across all departments. Attendance is mandatory, and preparation with the outlined agenda items is required. Please bring all relevant documentation and be ready for an interactive Q&A session.",
        start_at: new Date(),
        end_at: new Date(new Date().setHours(new Date().getHours() + 2)),
        color: '#6A1B9A'
      }
    ], // Replace with actual leave data
  };

  render() {
    const holidays = this.state.holidaysList.map((holiday) => ({
      id: holiday.id,
      title: holiday.occasion,
      start: moment(holiday.for_date).toDate(),
      end: moment(holiday.for_date).toDate(),
      color: holiday.color,
      allDay: true,
    }));

    const leaves = this.state.absentiesList.map((leave) => ({
      id: leave.id,
      title: leave.username,
      start: new Date(leave.start_at),
      end: new Date(leave.end_at),
      color: leave.color,
      allDay: true,
    }));

    const events = [...holidays, ...leaves];

    return (
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        views={{ week: true }}  // Only show the week view
        defaultView={Views.WEEK} // Set default to week view
        min={new Date(2025, 1, 1, 0, 0, 0)}
        max={new Date(2025, 1, 1, 0, 0, 0)}
        showMultiDayTimes={false}
        formats={{
          monthHeaderFormat: 'MMMM yyyy',
          dayRangeHeaderFormat: 'dddd, MMMM Do YYYY',
        }}
        eventPropGetter={event => {
          const eventData = events.find(ot => ot.id === event.id);
          const backgroundColor = eventData && eventData.color;
          return { style: { backgroundColor } };
        }}
      />
    );
  }
}

export default MyCalendar;