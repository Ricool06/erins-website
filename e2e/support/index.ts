import 'expect-webdriverio';
import { BrowserObject } from 'webdriverio';
import crypto from 'crypto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import awsconfig from '../aws-exports';

export const generateSecureString = ({ length, suffix }: { length?: number, suffix?: string } = {}) => crypto
  .randomBytes(length || 24)
  .toString('hex') + (suffix || '');

export const cognitoProvider = new CognitoIdentityServiceProvider();

export const signInUser = async (username: string, password: string, browser: BrowserObject) => {
  const authenticator = await browser.$('body > #root > div > header > amplify-authenticator');

  const authFields = await authenticator.shadow$('slot > amplify-sign-in')
    .then(el => el.shadow$('amplify-form-section > amplify-auth-fields'));

  const usernameField = await authFields.shadow$('div > amplify-username-field')
    .then(el => el.shadow$('amplify-form-field'))
    .then(el => el.shadow$('#username'));

  const passwordField = await authFields.shadow$('div > amplify-password-field')
    .then(el => el.shadow$('amplify-form-field'))
    .then(el => el.shadow$('#password'));

  await usernameField.setValue(username);
  await passwordField.setValue(password);

  await browser.keys('\uE006');

  const skipButton = await authenticator.shadow$('slot > amplify-verify-contact')
    .then(el => el.shadow$('amplify-form-section'))
    .then(el => el.shadow$('form > amplify-section > div:nth-child(3) > slot > div > span > amplify-button'));

  await skipButton.click();

  await browser.waitUntil(async () => !(await skipButton.isDisplayedInViewport()), { timeout: 20000 });
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

  return { username, password };
}

// document
// .querySelector("#root > div > header > amplify-authenticator").shadowRoot
