import crypto from 'crypto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import awsconfig from '../aws-exports';
import playwright, { BrowserContextOptions, Page } from 'playwright';

export const browserPromise = playwright.chromium.launch({
  headless: false,
});

export const baseUrlPlus = (path: string) => awsconfig.aws_content_delivery_url + path;

export const generateSecureString = ({ length, suffix }: { length?: number, suffix?: string } = {}) => crypto
  .randomBytes(length || 24)
  .toString('hex') + (suffix || '');

export const createBroswerContext = async (options?: BrowserContextOptions) => (await browserPromise)
  .newContext(options);

export const cognitoProvider = new CognitoIdentityServiceProvider();

export const signInUser = async (username: string, password: string, page: Page) => {
  await page.waitForSelector('#username');

  const usernameField = await page.$('#username');
  const passwordField = await page.$('#password');

  await usernameField!.type(username);
  await passwordField!.type(password);

  await page.keyboard.press('Enter');

  const skip = await page.waitForSelector('form > amplify-section > div:nth-child(3) > slot > div > span > amplify-button');

  await skip!.click();
}

export const createUser = async () => {
  const email = generateSecureString({ suffix: '@nowhere.eu' });
  const password = generateSecureString();

  const response = await cognitoProvider.adminCreateUser({
    UserPoolId: awsconfig.aws_user_pools_id,
    Username: email,
    TemporaryPassword: password,
    ForceAliasCreation: true,
    MessageAction: 'SUPPRESS',
    DesiredDeliveryMediums: ['EMAIL'],
  }).promise();

  const username = response?.User?.Username;
  const enabled = response?.User?.Enabled;
  expect(enabled).toBeTruthy();
  
  if(typeof username !== 'string') {
    throw Error(`Actual username was supposed to be a string, but was ${username}`);
  }

  await cognitoProvider.adminSetUserPassword({
    UserPoolId: awsconfig.aws_user_pools_id,
    Username: username,
    Password: password,
    Permanent: true,
  }).promise();

  await new Promise(resolve => setTimeout(resolve, 4000));

  return { username, password };
}
