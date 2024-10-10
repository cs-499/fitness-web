import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true }   
});

const surveySchema = new mongoose.Schema({
  userId:  { type: String, required: true },  
  answers: [answerSchema]                 
});

const Survey = mongoose.model('Survey', surveySchema);

export default Survey;
