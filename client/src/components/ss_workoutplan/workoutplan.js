import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';

const localizer = momentLocalizer(moment);

class workoutCalendar extends React.Component {
  // keep this as example, will be replaced by actuall API responses soon...
  ninjaAPI = {
    availabilityDays: [
      {
        id: 1,
        username: "Excercise for today",
        start_at: new Date(),
        end_at: new Date(new Date().setHours(new Date().getHours() + 2)),
        color: '#6A1B9A'
      }
    ], 
  };

  render() {
    const excercises = this.ninjaAPI.availabilityDays.map((excercise) => ({
      id: excercise.id,
      title: excercise.username,
      start: new Date(excercise.start_at),
      end: new Date(excercise.end_at),
      color: excercise.color,
      allDay: true,
    }));
    const events = [...excercises];

    return (
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        // Only show the week view 
        views={{ week: true }}
        defaultView={Views.WEEK}
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

export default workoutCalendar;