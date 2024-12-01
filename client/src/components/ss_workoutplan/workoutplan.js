import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';
import { getSpecificAnswer } from './getSurveyAnswers';
import NavBar from '../navbar/nav_bar';

const localizer = momentLocalizer(moment);

class WorkoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Array to store available days
      availabilityDays: [], 
    };
  }

  async componentDidMount() {
    await this.fetchAvailableDays();
  }

  async fetchAvailableDays() {
    const availableWeekdays = await getSpecificAnswer(localStorage.getItem('userId'), "How often do you want to work out?");
    
    const currentDate = moment();
    const availabilityDays = [];

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = currentDate.clone().add(weekOffset, 'weeks').startOf('week');
      const weekEnd = weekStart.clone().endOf('week');

      let currentDay = weekStart.clone();
      while (currentDay.isBefore(weekEnd) || currentDay.isSame(weekEnd, 'day')) {
        if (availableWeekdays.includes(currentDay.format('dddd'))) {
          availabilityDays.push({
            id: currentDay.format('YYYY-MM-DD'),
            title: `Available on ${currentDay.format('dddd')}`,
            start: currentDay.toDate(),
            end: currentDay.clone().endOf('day').toDate(),
            color: '#FFD700',
            // highlight available day
            highlighted: true 
          });
        }
        currentDay.add(1, 'day');
      }
    }

    // Update state with availability for a month
    this.setState({ availabilityDays });
  }

  render() {
    const events = this.state.availabilityDays.map((day) => ({
      id: day.id,
      title: day.title,
      start: day.start,
      end: day.end,
      color: day.color,
    }));

    return (
        <>
            <NavBar />
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
                    }}
                    eventPropGetter={event => {
                    const eventData = events.find(ot => ot.id === event.id);
                    const backgroundColor = eventData && eventData.color;
                    return { style: { backgroundColor } };
                    }}
                />
        </>

      
    );
  }
}

export default WorkoutCalendar;