// Import necessary libraries and components
import React from 'react'; // React library for creating components
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'; // React Big Calendar library for calendar UI
import moment from 'moment'; // Moment.js for date manipulation
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Styles for the calendar component
import './workoutplan.css'; // CSS specific to the Workout Plan component
import { fetchWorkoutPlansFromBackend, saveWorkoutPlansToBackend } from './workoutPlanService'; // Functions for fetching and saving workout plans
import groqCloudAi from './groqCloudAIapi.js'; // API for generating workout plans using Groq AI
import { getSpecificAnswer } from './getSurveyAnswers.js'; // Function to fetch specific survey answers
import NavBar from '../navbar/nav_bar.js'; // Navigation bar component

// Initialize the localizer for React Big Calendar using Moment.js
const localizer = momentLocalizer(moment);

class WorkoutCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilityDays: [], // Array to store user availability days
      workoutPlans: {}, // Object to store workout plans
      isLoading: true, // Loading state for displaying a spinner
    };
  }

  // Lifecycle method to fetch data and initialize the calendar
  async componentDidMount() {
    try {
      const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
      if (!userId) {
        this.setState({ isLoading: false });
        return; // Exit if user ID is not available
      }

      // Fetch user's available days based on their survey response
      await this.fetchAvailableDays();

      // Fetch workout plans from the backend
      let workoutPlans = await fetchWorkoutPlansFromBackend(userId);

      // Identify missing dates where no workout plans exist
      const missingDates = this.state.availabilityDays
        .filter((day) => !workoutPlans[day.id]) // Filter out days without plans
        .map((day) => day.id);

      // Generate workout plans for missing dates using Groq AI
      if (missingDates.length > 0) {
        console.log('Generating missing plans with Groq AI...');
        const generatedPlans = await this.generatePlansWithGroqAI(userId, missingDates);

        // Merge newly generated plans with existing plans
        workoutPlans = { ...workoutPlans, ...generatedPlans };

        console.log('Saving updated plans to backend...');
        await saveWorkoutPlansToBackend(userId, workoutPlans); // Save the updated plans to the backend
      }

      this.setState({ workoutPlans, isLoading: false }); // Update state with workout plans and set loading to false
    } catch (error) {
      console.error('Error initializing calendar:', error);
      this.setState({ isLoading: false }); // Stop loading in case of an error
    }
  }

  /**
   * Fetches user availability for the next 4 weeks based on a survey response.
   */
  async fetchAvailableDays() {
    const availableWeekdays = await getSpecificAnswer(localStorage.getItem('userId'), 'How often do you want to work out?'); // Get available weekdays from the survey response

    const currentDate = moment(); // Get the current date
    const availabilityDays = []; // Initialize an array for available days

    // Loop through the next 4 weeks to calculate available days
    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      const weekStart = currentDate.clone().add(weekOffset, 'weeks').startOf('week'); // Start of the week
      const weekEnd = weekStart.clone().endOf('week'); // End of the week

      let currentDay = weekStart.clone();
      while (currentDay.isBefore(weekEnd) || currentDay.isSame(weekEnd, 'day')) {
        if (availableWeekdays.includes(currentDay.format('dddd'))) { // Check if the day is in the user's availability
          availabilityDays.push({
            id: currentDay.format('YYYY-MM-DD'), // Format date as YYYY-MM-DD
            title: `Available on ${currentDay.format('dddd')}`, // Title for the day
            start: currentDay.toDate(), // Start time as a Date object
            end: currentDay.clone().endOf('day').toDate(), // End time as a Date object
            color: '#FFD700', // Highlight available days with gold color
            highlighted: true, // Indicate that the day is highlighted
          });
        }
        currentDay.add(1, 'day'); // Move to the next day
      }
    }
    this.setState({ availabilityDays }); // Update state with calculated available days
  }

  /**
   * Generate workout plans for missing dates using Groq AI.
   * @param {string} userId - The user ID
   * @param {Array} missingDates - Array of dates with missing workout plans
   */
  async generatePlansWithGroqAI(userId, missingDates) {
    const generatedPlans = {}; // Initialize an object to store generated plans

    // Loop through each missing date and generate a plan
    for (const date of missingDates) {
      try {
        const response = await groqCloudAi(userId, date); // Call the Groq AI API
        if (response.success) {
          generatedPlans[date] = response.plan; // Store the generated plan
        } else {
          console.error(`Failed to generate plan for ${date}:`, response.error); // Log any errors
        }
      } catch (error) {
        console.error(`Error generating plan for ${date} with Groq AI:`, error); // Catch and log any API errors
      }
    }
    return generatedPlans; // Return the generated plans
  }

  render() {
    const { availabilityDays, workoutPlans, isLoading } = this.state; // Destructure state variables

    // Map available days to calendar events
    const events = availabilityDays.map((day) => ({
      id: day.id,
      title: workoutPlans[day.id] || day.title || 'No exercise available', // Use workout plan or default title
      start: day.start, // Event start time
      end: day.end, // Event end time
      color: day.color, // Event color
    }));

    return (
      <>
        <NavBar /> {/* Include the navigation bar */}
        <div className="calendar-container">
          {isLoading ? (
            <div className="spinner-container"> {/* Show spinner while loading */}
              <div className="spinner"></div>
              <p>Loading workout plans...</p>
            </div>
          ) : (
            <Calendar
              localizer={localizer} // Use moment.js localizer
              events={events} // Pass the events to the calendar
              startAccessor="start" // Start time accessor
              endAccessor="end" // End time accessor
              defaultDate={moment().toDate()} // Set the default date to today
              views={{ week: true }} // Display only the week view
              defaultView={Views.WEEK} // Default view is week
              eventPropGetter={(event) => ({
                style: { backgroundColor: event.color || '#ADD8E6' }, // Set background color for events
                color: '#000', // Set text color
              })}
              components={{
                event: ({ event }) => (
                  <div className="workout-plan-box">
                    <p>{event.title}</p> {/* Display event title */}
                  </div>
                ),
              }}
            />
          )}
        </div>
      </>
    );
  }
}

export default WorkoutCalendar; // Export the component for use in other parts of the application
