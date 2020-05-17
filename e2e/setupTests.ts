import awsconfig from './aws-exports';
import { browserPromise } from "./support";
import { API } from "aws-amplify";

beforeAll(() => API.configure(awsconfig));
afterAll(async () => await (await browserPromise).close());
