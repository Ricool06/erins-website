import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import WritePostContainer from './cms/WritePostContainer';
import 'antd/dist/antd.css'

function App() {
  return (
      <div className="App">
        <Router>
          <header className="App-header">
            <Link to='/new-post'>Login</Link>
          </header>
          <Switch >
            <Route exact path='/new-post'>
              {/* <AmplifyAuthenticator >
                  <AmplifySignUp formFields={[
                    { type: 'email' },
                    { type: 'password' },
                  ]} usernameAlias='email' slot='sign-up'></AmplifySignUp> */}
              <WritePostContainer />
              {/* </AmplifyAuthenticator> */}
            </Route>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
