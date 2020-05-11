import 'expect-webdriverio';
import awsconfig from '../aws-exports';
import chromedriver from 'chromedriver';
import { remote, BrowserObject } from 'webdriverio';
import { cognitoProvider, signInUser, createUser } from '../support';

jest.setTimeout(30000);

describe('Login', () => {
  let browser: BrowserObject;
  let username: string;
  let password: string;

  beforeAll(async () => {
    await chromedriver.start(['--port=9515']);

    browser = await remote({
      logLevel: 'warn',
      baseUrl: awsconfig.aws_content_delivery_url,
      capabilities: {
        browserName: 'chrome',
      },
      automationProtocol: 'webdriver',
      port: 9515
    });

    (global as any).browser = browser;

    const user = await createUser();
    username = user.username;
    password = user.password;
  });

  it('should allow a logged-in user to write a new post', async () => {
    await browser.url('/');
    await browser.execute(() => localStorage.clear());
    await browser.url('/new-post');

    await signInUser(username, password, browser);

    expect(await (await browser.$('textarea')).isDisplayed()).toBe(true);
  });

  afterAll(async () => {
    await browser.deleteSession();
    await browser.shutdown();
    await chromedriver.stop();

    await cognitoProvider.adminDeleteUser({
      UserPoolId: awsconfig.aws_user_pools_id,
      Username: username,
    }).promise();
  });
});


