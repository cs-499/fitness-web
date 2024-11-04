// tests/getExercisesBasedOnExperience.test.js
import getExercisesByExperienceLevel from '../src/api/v1/ninjaApi.js';
import request from 'request';
import { getSpecificAnswer } from '../src/api/v1/parseSurvey.js';

jest.mock('request');
jest.mock('../src/api/v1/parseSurvey.js');

describe('getExercisesByExperienceLevel', () => {
    beforeAll(() => {
        // put some dummy key
        process.env.NINJA_API = 'dbvsabsjbvbvdshba';
    });

    it('should call the API with the correct difficulty level based on experience', async () => {
        const surveyResponses = [
            { question: 'What is your experience level?', answer: 'Beginner' },
        ];
        getSpecificAnswer.mockResolvedValue('Beginner');

        // Mock the request.get implementation
        request.get.mockImplementation((options, callback) => {
            callback(null, { statusCode: 200 }, 'Mocked response body');
        });

        await getExercisesByExperienceLevel(surveyResponses);

        // Simplify the assertion to match only specific properties in the options object
        expect(request.get).toHaveBeenCalledWith(expect.objectContaining({
            url: expect.stringContaining('difficulty=beginner'),
            headers: expect.objectContaining({
                'X-Api-Key': process.env.NINJA_API,
            }),
        }), expect.any(Function));
    });

    it('should log an error if no experience level is found', async () => {
        const surveyResponses = [];
        getSpecificAnswer.mockResolvedValue('');
        console.log = jest.fn();

        await getExercisesByExperienceLevel(surveyResponses);

        expect(console.log).toHaveBeenCalledWith('No experience level found.');
    });

    it('should log an error if an invalid experience level is provided', async () => {
        const surveyResponses = [
            { question: 'What is your experience level?', answer: 'Unknown' },
        ];
        getSpecificAnswer.mockResolvedValue('Unknown');
        console.log = jest.fn();

        await getExercisesByExperienceLevel(surveyResponses);

        expect(console.log).toHaveBeenCalledWith('No matching difficulty level found for experience:', 'Unknown');
    });
});