import awsconfig from '../aws-exports';
import { cognitoProvider, signInUser, createUser, createBroswerContext, baseUrlPlus } from '../support';
import { ChromiumBrowserContext } from 'playwright';
import { randomBytes } from 'crypto';

jest.setTimeout(30000);

describe('Login', () => {
  let ctx: ChromiumBrowserContext;
  let username: string;
  let password: string;

  beforeAll(async () => {
    const user = await createUser();
    username = user.username;
    password = user.password;
  });

  beforeEach(async () => {
    ctx = await createBroswerContext();
  });

  it('should allow a logged-in user to write a new post', async () => {
    const page = await ctx.newPage();
    await page.goto(baseUrlPlus('/new-post'));

    await signInUser(username, password, page);
    const titleInput = await page.$('input');
    const textArea = await page.$('textarea');
    const postButton = await page.$('button.ant-btn-primary');

    await titleInput!.type('This is a new title!');
    await textArea!.type('This is a new blog post!');
    await postButton!.click();

    const toast = await page.waitForSelector('div.ant-result-title');

    expect(await toast!.innerText()).toContain('Blog posted! 😘');
  });

  it('should prevent users that are not logged in from writing posts', async () => {
    const page = await ctx.newPage();
    await page.goto(baseUrlPlus('/new-post'));

    await page.waitForSelector('#username');

    const usernameField = await page.$('#username');
    const passwordField = await page.$('#password');

    await usernameField!.type('notvalid');
    await passwordField!.type('wrong');

    await page.keyboard.press('Enter');

    const toast = await page.waitForSelector('div.toast');

    expect(await toast.innerText()).toContain('User does not exist');
  });

  it.only('should show submitted posts on the front page', async () => {
    const page = await ctx.newPage();
    await page.goto(baseUrlPlus('/new-post'));
    const uniqueSlug = randomBytes(8).toString('base64');

    await signInUser(username, password, page);
    const titleInput = await page.$('input');
    const textArea = await page.$('textarea');
    const postButton = await page.$('button.ant-btn-primary');

    await titleInput!.type(`${uniqueSlug} first title!`);
    await textArea!.type(`This is the first blog post!`);
    await postButton!.click();

    const okButton = await page.waitForSelector('div.ant-modal-confirm-btns > button');
      
    okButton.click();

    await titleInput!.fill(`${uniqueSlug} second title!`);
    await textArea!.fill('This is the second blog post!');
    await postButton!.click();

    await page.goto(baseUrlPlus('/'));

    const cards = await page.$$('card');

    const innerTexts = await Promise.all(cards.map(card => card.innerText()));

    expect(innerTexts[0]).toContain(uniqueSlug);
    expect(innerTexts[1]).toContain(uniqueSlug);
  });

  afterAll(async () => {
    await cognitoProvider.adminDeleteUser({
      UserPoolId: awsconfig.aws_user_pools_id,
      Username: username,
    }).promise();

    await ctx.close();
  });
});


