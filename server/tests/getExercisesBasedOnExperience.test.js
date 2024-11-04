// tests/getExercisesBasedOnExperience.test.js
import getExercisesByExperienceLevel from '../src/controllers/api/v1/ninjaApi';
import request from 'request';
import { getSpecificAnswer } from '../src/controllers/api/v1/parseSurvey'; // Adjust import as necessary

jest.mock('request');
jest.mock('../src/controllers/api/v1/parseSurvey');

describe('getExercisesByExperienceLevel', () => {
    // Mock the environment variable before all tests
    beforeAll(() => {
        process.env.NINJA_API = 'mocked_api_key'; // Set your mocked API key
    });

    it('should call the API with the correct difficulty level based on experience', async () => {
        const surveyResponses = [
            { question: 'What is your experience level?', answer: 'Beginner' },
        ];
        getSpecificAnswer.mockResolvedValue('Beginner'); // Mocking the resolved value

        // Mock the request.get implementation
        request.get.mockImplementation((options, callback) => {
            callback(null, { statusCode: 200 }, 'Mocked response body');
        });

        await getExercisesByExperienceLevel(surveyResponses);

        expect(request.get).toHaveBeenCalledWith(expect.objectContaining({
            url: expect.stringContaining('difficulty=beginner'),
            headers: {
                'X-Api-Key': process.env.NINJA_API, // Ensure this is set up as expected
            },
        }));
    });

    it('should log an error if no experience level is found', async () => {
        const surveyResponses = [];
        getSpecificAnswer.mockResolvedValue(''); // Mocking no experience level found

        console.log = jest.fn(); // Mock console.log

        await getExercisesByExperienceLevel(surveyResponses);

        expect(console.log).toHaveBeenCalledWith('No experience level found.');
    });

    it('should log an error if an invalid experience level is provided', async () => {
        const surveyResponses = [
            { question: 'What is your experience level?', answer: 'UnknownLevel' },
        ];
        getSpecificAnswer.mockResolvedValue('UnknownLevel'); // Mocking an invalid level

        console.log = jest.fn(); // Mock console.log

        await getExercisesByExperienceLevel(surveyResponses);

        expect(console.log).toHaveBeenCalledWith('No matching difficulty level found for experience:', 'UnknownLevel');
    });
});