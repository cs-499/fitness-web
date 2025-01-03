export async function fetchWorkoutPlansFromBackend(userId) {
  try {
    console.log(`Fetching workout plans for userId: ${userId}`);

    const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/workout-plan/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    return {}; 
  }
}

export async function saveWorkoutPlansToBackend(userId, plans) {
    try {
      // Convert `plans` object to an array of { date, plan }
      const plansArray = Object.entries(plans).map(([date, plan]) => ({ date, plan }));
  
      console.log('Saving workout plans with body:', { userId, plans: plansArray });
  
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/workout-plan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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