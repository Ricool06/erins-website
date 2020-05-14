import awsconfig from '../aws-exports';
import { cognitoProvider, signInUser, createUser, createBroswerContext, baseUrlPlus } from '../support';
import { ChromiumBrowserContext } from 'playwright';

jest.setTimeout(30000);

describe('Login', () => {
  let ctx: ChromiumBrowserContext;
  let username: string;
  let password: string;

  beforeAll(async () => {
    const user = await createUser();
    username = user.username;
    password = user.password;

    ctx = await createBroswerContext();
  });

  it('should allow a logged-in user to write a new post', async () => {
    const page = await ctx.newPage();
    await page.goto(baseUrlPlus('/new-post'));

    await signInUser(username, password, page);
    const textArea = await page.$('textarea');
    const postButton = await page.$('button');

    await textArea!.type('This is a new blog post!');
    await postButton!.click();

    const toast = await page.$('#toast');

    expect(toast!.textContent).toContain('Blog post created!');
  });

  afterAll(async () => {
    await cognitoProvider.adminDeleteUser({
      UserPoolId: awsconfig.aws_user_pools_id,
      Username: username,
    }).promise();
  });
});


