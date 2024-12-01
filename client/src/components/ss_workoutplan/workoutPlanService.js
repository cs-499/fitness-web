const BACKEND_URL = 'http://localhost:5000/api/workout-plan';

/**
 * Fetch workout plans for a user from the backend.
 */
export async function fetchWorkoutPlansFromBackend(userId) {
  try {
    console.log(`Fetching workout plans for userId: ${userId}`);

    const response = await fetch(`${BACKEND_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional token if needed
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workout plans. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched workout plans:', data);

    return data.workoutPlans || {};
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return {}; // Return empty object on error
  }
}

/**
 * Save or update workout plans for a user in the backend.
 */
export async function saveWorkoutPlansToBackend(userId, plans) {
    try {
      // Convert `plans` object to an array of { date, plan }
      const plansArray = Object.entries(plans).map(([date, plan]) => ({ date, plan }));
  
      console.log('Saving workout plans with body:', { userId, plans: plansArray });
  
      const response = await fetch('http://localhost:5000/api/workout-plan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional token if required
        },
        body: JSON.stringify({ userId, plans: plansArray }),
      });
  
      console.log('Backend response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend save error:', errorData);
        throw new Error(`Failed to save plans. Backend error: ${errorData.error}`);
      }
  
      const data = await response.json();
      console.log('Workout plans saved successfully:', data);
    } catch (error) {
      console.error('Error saving workout plans:', error);
      throw error;
    }
  }  