import React from 'react';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import WritePostContainer from './cms/WritePostContainer';
import 'antd/dist/antd.css'
import { Menu, Layout, Row, Col } from 'antd';
import PostGridContainer from './blog/PostGridContainer';
import PostViewContainer from './blog/PostViewContainer';

function App() {

  const navMenu = (
    <Menu mode='horizontal'>
      <Menu.Item>
        <Link to='/'>Blog</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to='/new-post'>New Post</Link>
      </Menu.Item>
    </Menu>
  );

  const desktopHeader = (
    <header>
      <Row justify='space-between' align='bottom'>
        <Col md={4} span={0}>

        </Col>
        <Col span={16}>
          <h2 style={{ padding: '0 1rem' }}>erin crocker</h2>
        </Col>
        <Col md={4} span={4}>
          {navMenu}
        </Col>
      </Row>
    </header>
  );

  return (
    // <Layout>
    <Router>
      {desktopHeader}
      <Layout.Content>
        <Switch>
          <Route exact path='/'>
            <PostGridContainer />
          </Route>

          <Route exact path='/new-post'>
            <Row justify='space-around'>
              <Col>
                <AmplifyAuthenticator >
                  {/* <AmplifySignUp  formFields={[
                    { type: 'email' },
                    { type: 'password' },
                  ]} usernameAlias='email' slot='sign-up'></AmplifySignUp> */}
                  <div slot='sign-up'></div>
                  <WritePostContainer />
                </AmplifyAuthenticator>
              </Col>
            </Row>
          </Route>

          <Route path='/post/:postId'>
            <PostViewContainer />
          </Route>

        </Switch>
      </Layout.Content>
      <Layout.Footer>
        Created by Ryan Perry
        </Layout.Footer>
    </Router>
    // </Layout>
  );
}

export default App;
