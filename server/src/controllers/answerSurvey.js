import Survey from '../models/survey.js'

export const submitSurvey = async (req, res) => {
  const { userId, answers } = req.body;
  try {
    let survey = await Survey.findOne({ userId });
    if (survey) {
      survey.answers = answers;
    } else {
      survey = new Survey({ userId, answers });
    }
    await survey.save();
    res.status(200).json();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const getSurveyByUserId = async (req, res) => {
  try {
    const survey = await Survey.findOne({ userId: req.params.userId });
    res.status(survey ? 200 : 404).json(survey || { message: 'Survey not found for this user.' });
  } catch (error) {res.sendStatus(500);}
};
