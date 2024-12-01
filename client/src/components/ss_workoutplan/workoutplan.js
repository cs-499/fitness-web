import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './workoutplan.css';
import { fetchWorkoutPlansFromBackend, saveWorkoutPlansToBackend } from './workoutPlanService';
import { groqCloudAi } from './groqCloudAIapi.js';

const localizer = momentLocalizer(moment);

class WorkoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilityDays: [], // Days with workout plans
      workoutPlans: {}, // Fetched/generated workout plans
      isLoading: true, // Loading spinner state
    };
  }

  async componentDidMount() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage.');
        this.setState({ isLoading: false });
        return;
      }

      console.log('Fetching existing workout plans...');
      let workoutPlans = await fetchWorkoutPlansFromBackend(userId);

      console.log('Checking for missing dates...');
      const missingDates = this.getMissingDates(workoutPlans);

      if (missingDates.length > 0) {
        console.log('Generating missing plans with Groq AI...');
        const generatedPlans = await this.generatePlansWithGroqAI(userId, missingDates);
        console.log('Generated plans:', generatedPlans);

        // Merge generated plans with existing ones
        workoutPlans = { ...workoutPlans, ...generatedPlans };

        console.log('Saving updated plans to backend...');
        await saveWorkoutPlansToBackend(userId, workoutPlans);
      }

      console.log('Generating availability days...');
      const availabilityDays = this.generateAvailabilityDays(workoutPlans);

      console.log('Updating state...');
      this.setState({ availabilityDays, workoutPlans, isLoading: false });
    } catch (error) {
      console.error('Error initializing calendar:', error);
      this.setState({ isLoading: false });
    }
  }

  /**
   * Identify dates with missing workout plans.
   */
  getMissingDates(workoutPlans) {
    const missingDates = [];
    const currentDate = moment();

    // Check for the next 4 weeks
    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = currentDate.clone().add(weekOffset, 'weeks').startOf('week');
      const weekEnd = weekStart.clone().endOf('week');

      let currentDay = weekStart.clone();
      while (currentDay.isSameOrBefore(weekEnd)) {
        const dateId = currentDay.format('YYYY-MM-DD');
        if (!workoutPlans[dateId]) {
          missingDates.push(dateId);
        }
        currentDay.add(1, 'day');
      }
    }

    console.log('Missing dates:', missingDates);
    return missingDates;
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

  /**
   * Generate availability days based on workout plans data.
   */
  generateAvailabilityDays(workoutPlans) {
    const availabilityDays = [];
    const currentDate = moment();

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = currentDate.clone().add(weekOffset, 'weeks').startOf('week');
      const weekEnd = weekStart.clone().endOf('week');

      let currentDay = weekStart.clone();
      while (currentDay.isSameOrBefore(weekEnd)) {
        const dateId = currentDay.format('YYYY-MM-DD');

        if (workoutPlans[dateId]) {
          availabilityDays.push({
            id: dateId,
            date: currentDay.clone(),
            color: '#FFD700', // Highlight color for workout days
          });
        }

        currentDay.add(1, 'day');
      }
    }

    return availabilityDays;
  }

  render() {
    const { availabilityDays, workoutPlans, isLoading } = this.state;

    const events = availabilityDays.map((day) => ({
      id: day.id,
      title: workoutPlans[day.id] || 'Rest day - No workout plan available',
      start: day.date.toDate(),
      end: day.date.clone().endOf('day').toDate(),
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