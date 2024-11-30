import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';
import { getSpecificAnswer } from './getSurveyAnswers.js';
import groqCloudAi from './groqCloudAIapi.js';

const localizer = momentLocalizer(moment);

class WorkoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Store available days with workout plans
      availabilityDays: [],
      // Show spinner while loading
      loading: true,
    };
  }

  async componentDidMount() {
    await this.fetchAvailableDays();
  }

  async fetchAvailableDays() {
    const userId = localStorage.getItem('userId');
    const availableWeekdays = await getSpecificAnswer(
      userId,
      'How often do you want to work out?'
    );

    const currentDate = moment();
    const availabilityDays = [];

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = currentDate.clone().add(weekOffset, 'weeks').startOf('week');
      const weekEnd = weekStart.clone().endOf('week');

      let currentDay = weekStart.clone();
      while (currentDay.isBefore(weekEnd) || currentDay.isSame(weekEnd, 'day')) {
        if (availableWeekdays.includes(currentDay.format('dddd'))) {
          const workoutPlan = await groqCloudAi(userId); // Fetch workout plan
          availabilityDays.push({
            id: currentDay.format('YYYY-MM-DD'),
            workoutPlan, // Add the workout plan text
            date: currentDay,
            color: '#FFD700', // Highlight color
          });
        }
        currentDay.add(1, 'day');
      }
    }

    this.setState({ availabilityDays, loading: false }); // Stop loading when complete
  }

  render() {
    const { availabilityDays, loading } = this.state;

    // Show spinner while loading
    if (loading) {
      return (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      );
    }

    return (
      <Calendar
        localizer={localizer}
        events={availabilityDays.map((day) => ({
          id: day.id,
          title: day.workoutPlan, // Display workout plan in the event
          start: day.date.toDate(),
          end: day.date.clone().endOf('day').toDate(),
          color: day.color,
        }))}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        views={{ week: true }}
        defaultView={Views.WEEK}
        eventPropGetter={(event) => {
          const backgroundColor = event.color;
          return {
            style: {
              backgroundColor,
              color: 'black',
              fontWeight: 'bold',
              fontSize: '0.9em',
              padding: '10px',
              whiteSpace: 'pre-wrap',
              borderRadius: '5px',
            },
          };
        }}
        dayPropGetter={(date) => {
          const dayString = moment(date).format('YYYY-MM-DD');
          const isAvailable = availabilityDays.some((day) => day.id === dayString);
          return isAvailable ? { className: 'highlighted' } : {};
        }}
      />
    );
  }
}

export default WorkoutCalendar;