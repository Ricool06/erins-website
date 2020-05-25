import React from 'react';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { Link, Switch, Route, useLocation } from 'react-router-dom';
import WritePostContainer from './cms/WritePostContainer';
import 'antd/dist/antd.css'
import { Menu, Layout, Row, Col, Typography } from 'antd';
import PostGridContainer from './blog/PostGridContainer';
import PostViewContainer from './blog/PostViewContainer';

function App() {
  const location = useLocation();

  const navMenu = (
    <Menu selectedKeys={[location.pathname]} mode='horizontal'>
      <Menu.Item key='/'>
        <Link to='/'>Blog</Link>
      </Menu.Item>
      <Menu.Item key='/new-post'>
        <Link to='/new-post'>New Post</Link>
      </Menu.Item>
    </Menu>
  );

  const desktopHeader = (
    <header>
      <Row justify='space-between' align='bottom'>
        <Col sm={4} span={0}>

        </Col>
        <Col span={16}>
          <Link to='/'>
            <Typography.Title level={2} style={{ padding: '0 1rem' }}>
              erin crocker
          </Typography.Title>
          </Link>
        </Col>
        <Col sm={4} span={4}>
          {navMenu}
        </Col>
      </Row>
    </header>
  );

  return (
    <>
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
        <Typography.Paragraph>©2020 Erin Crocker</Typography.Paragraph>
        <a href='https://www.ricool.uk'>Designed and developed by Ryan Perry</a>
      </Layout.Footer>
    </>
  );
}

export default App;
