import { submitSurvey } from '../src/controllers/survey.js';
import Survey from '../src/models/createSurvey.js';

jest.mock('../src/models/createSurvey.js');

describe('submitSurvey', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userId: 'nikola',
                answers: {
                    question1: 'Vegan',
                    question2: ['Gluten', 'Shellfish']
                }
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should return 400 if userId is missing', async () => {
        req.body.userId = null;
        await submitSurvey(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should save survey with unique answers and respond with 201', async () => {
        const saveMock = jest.fn().mockResolvedValue({});
        Survey.mockImplementation(function () {
            this.userId = req.body.userId;
            this.answers = new Map([
                ['question1', ['Vegan']],
                ['question2', ['Gluten', 'Shellfish']]
            ]);
            this.save = saveMock;
        });

        await submitSurvey(req, res);

        const surveyInstance = Survey.mock.instances[0];
        expect(surveyInstance.userId).toBe('nikola');
        expect(surveyInstance.answers.get('question1')).toEqual(['Vegan']);
        expect(surveyInstance.answers.get('question2')).toEqual(['Gluten', 'Shellfish']);
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Survey saved successfully!' });
    });

    it('should handle errors and respond with 500', async () => {
        // Mock Survey instance to ensure `answers` is a Map
        Survey.mockImplementation(function () {
            this.userId = req.body.userId;
            this.answers = new Map();
            this.save = jest.fn().mockRejectedValue(new Error('Save error'));
        });

        await submitSurvey(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Save error' });
    });
});