import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';
import { fetchWorkoutPlansFromBackend, saveWorkoutPlansToBackend } from './workoutPlanService';
import { groqCloudAi } from './groqCloudAIapi.js';
import { getSpecificAnswer } from './getSurveyAnswers.js';

const localizer = momentLocalizer(moment);

class WorkoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Days with user availability
      availabilityDays: [],
      // Fetched/generated workout plans
      workoutPlans: {},
      isLoading: true,
    };
  }

  async componentDidMount() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.setState({ isLoading: false });
        return;
      }
      await this.fetchAvailableDays();

      let workoutPlans = await fetchWorkoutPlansFromBackend(userId);
      const missingDates = this.state.availabilityDays
        .filter((day) => !workoutPlans[day.id])
        .map((day) => day.id);

      if (missingDates.length > 0) {
        console.log('Generating missing plans with Groq AI...');
        const generatedPlans = await this.generatePlansWithGroqAI(userId, missingDates);

        workoutPlans = { ...workoutPlans, ...generatedPlans };

        console.log('Saving updated plans to backend...');
        await saveWorkoutPlansToBackend(userId, workoutPlans);
      }

      this.setState({ workoutPlans, isLoading: false });
    } catch (error) {
      console.error('Error initializing calendar:', error);
      this.setState({ isLoading: false });
    }
  }

  /**
   * Fetches user availability for the next 4 weeks based on a survey response.
   */
  async fetchAvailableDays() {
    const availableWeekdays = await getSpecificAnswer(localStorage.getItem('userId'), 'How often do you want to work out?');

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
            // Highlight each available day
            color: '#FFD700',
            highlighted: true,
          });
        }
        currentDay.add(1, 'day');
      }
    }
    this.setState({ availabilityDays });
  }

  /**
   * Generate workout plans for missing dates using Groq AI.
   */
  async generatePlansWithGroqAI(userId, missingDates) {
    const generatedPlans = {};

    for (const date of missingDates) {
      try {
        const response = await groqCloudAi(userId, date);
        if (response.success) {
          generatedPlans[date] = response.plan;
        } else {
          console.error(`Failed to generate plan for ${date}:`, response.error);
        }
      } catch (error) {
        console.error(`Error generating plan for ${date} with Groq AI:`, error);
      }
    }
    return generatedPlans;
  }

  render() {
    const { availabilityDays, workoutPlans, isLoading } = this.state;

    const events = availabilityDays.map((day) => ({
      id: day.id,
      title: workoutPlans[day.id] || day.title || 'No excercise available',
      start: day.start,
      end: day.end,
      color: day.color,
    }));

    return (
      <div className="calendar-container">
        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading workout plans...</p>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            views={{ week: true }}
            defaultView={Views.WEEK}
            eventPropGetter={(event) => ({
              style: { backgroundColor: event.color || '#ADD8E6' },
              color: '#000',
            })}
            components={{
              event: ({ event }) => (
                <div className="workout-plan-box">
                  <p>{event.title}</p>
                </div>
              ),
            }}
          />
        )}
      </div>
    );
  }
}

export default WorkoutCalendar;