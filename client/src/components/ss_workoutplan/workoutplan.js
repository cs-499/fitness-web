import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';
import getExercisesByExperienceLevel from './ninjaAPI.js';

const localizer = momentLocalizer(moment);

class workoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilityDays: [
        {
          id: 1,
          username: "Exercise for today", // Placeholder, to be replaced by fetched data
          start_at: new Date(),
          end_at: new Date(new Date().setHours(new Date().getHours() + 2)),
          color: '#6A1B9A',
        },
      ],
    };
  }

  async componentDidMount() {
    try {
        // Fetch exercises
        const exercises = await getExercisesByExperienceLevel();

        // Update the availabilityDays with the fetched exercise
        this.setState((prevState) => ({
            availabilityDays: prevState.availabilityDays.map((day) => ({
                ...day,
                username: exercises.length > 0 ? exercises[0]?.name : 'No exercise found for selected day',
            })),
        }));
    } catch (error) {
        console.error('Error fetching exercises:', error);
        this.setState((prevState) => ({
            availabilityDays: prevState.availabilityDays.map((day) => ({
                ...day,
                username: 'Error fetching exercises',
            })),
        }));
    }
}

  render() {
    const excercises = this.state.availabilityDays.map((excercise) => ({
      id: excercise.id,
      title: excercise.username, // Use updated username
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
        views={{ week: true }}
        defaultView={Views.WEEK}
        min={new Date(2025, 1, 1, 0, 0, 0)}
        max={new Date(2025, 1, 1, 0, 0, 0)}
        showMultiDayTimes={false}
        formats={{
          monthHeaderFormat: 'MMMM yyyy',
          dayRangeHeaderFormat: 'dddd, MMMM Do YYYY',
        }}
        eventPropGetter={(event) => {
          const eventData = events.find((ot) => ot.id === event.id);
          const backgroundColor = eventData && eventData.color;
          return { style: { backgroundColor } };
        }}
      />
    );
  }
}

export default workoutCalendar;