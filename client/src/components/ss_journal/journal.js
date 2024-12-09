import React, { useState, useEffect } from 'react';
import './journal.css';
import NavBar from "../navbar/nav_bar";

const Recipes = () => {
    document.title = 'ShapeShifter';

    const [meals, setMeals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals') || '[]');
        const savedNotes = JSON.parse(localStorage.getItem('journalNotes') || '[]');
        setMeals(savedMeals);
        setNotes(savedNotes);
    }, []);

    const saveNote = () => {
        if (newNote.trim()) {
            const timestamp = new Date().toLocaleString();
            const updatedNotes = [...notes, { text: newNote.trim(), timestamp }];
            setNotes(updatedNotes);
            setNewNote('');
            localStorage.setItem('journalNotes', JSON.stringify(updatedNotes));
        }
    };

    const deleteNote = (index) => {
        const updatedNotes = notes.filter((_, i) => i !== index);
        setNotes(updatedNotes);
        localStorage.setItem('journalNotes', JSON.stringify(updatedNotes));
    };

    const deleteMeal = (id) => {
        const updatedMeals = meals.filter((meal) => meal.id !== id);
        setMeals(updatedMeals);
        localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
    };

    const totalCalories = meals.reduce((sum, meal) => {
        const calories = parseFloat(meal.calories);
        return !isNaN(calories) ? sum + calories : sum;
    }, 0);

    const groupedMeals = meals.reduce((grouped, meal) => {
        const date = meal.timestamp ? new Date(meal.timestamp).toLocaleDateString() : 'Unknown Date';
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(meal);
        return grouped;
    }, {});

    return (
        <>
            <NavBar />
            <div className="journal-container">
                <h1>Your Saved Meals</h1>
                {Object.keys(groupedMeals).length > 0 ? (
                    Object.entries(groupedMeals).map(([date, mealsForDate]) => (
                        <div key={date} style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#1e293b', textAlign: 'center', marginBottom: '1rem' }}>
                                {date}
                            </h2>
                            {mealsForDate.map((meal) => (
                                <div key={meal.id} className="meal-item">
                                    <div>
                                        <h2>{meal.title}</h2>
                                        <p>Calories: {meal.calories}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMeal(meal.id)}
                                        style={{
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No meals saved yet. Start saving meals from the recipe page!</p>
                )}
                {meals.length > 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '2rem',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1e293b',
                        }}
                    >
                        Total Calories: {totalCalories.toFixed(2)} kcal
                    </div>
                )}
                <div className="notes-section">
                    <h2>Journal Notes</h2>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a new note..."
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <button
                        onClick={saveNote}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '1rem auto',
                            backgroundColor: '#1e293b',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            width: '120px',
                            height: '50px',
                            textAlign: 'center',
                            lineHeight: '1',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        Save
                    </button>
                    <div className="saved-notes">
                        {notes.length > 0 ? (
                            notes.map((note, index) => (
                                <div key={index} className="note-item">
                                    <p>{note.text}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#555' }}>
                                        Saved on: {note.timestamp}
                                    </p>
                                    <button
                                        onClick={() => deleteNote(index)}
                                        style={{
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            padding: '0.3rem 1rem',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No notes saved yet. Start writing your thoughts!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Recipes;