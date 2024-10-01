import bodyParser from 'body-parser';

const bodyParserMiddleware = bodyParser.urlencoded({ extended: true });
export default bodyParserMiddleware;

