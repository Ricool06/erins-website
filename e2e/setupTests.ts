import { browserPromise } from "./support";

afterAll(async () => await (await browserPromise).close());
