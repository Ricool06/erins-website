import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.css';
import WritePost from './cms/WritePost';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Link to='/new-post'>Login</Link>
          <Switch >
            <Route exact path='/new-post'>
              <AmplifyAuthenticator >
                <AmplifySignUp formFields={[
                  { type: 'email' },
                  { type: 'password' },
                ]} usernameAlias='email' slot='sign-up'></AmplifySignUp>
                <WritePost></WritePost>
              </AmplifyAuthenticator>
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
