import React, { Component } from 'react';
import firebase from './components/firebase';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notesMade: [],
      user: null,
      username: null,
      password: null,
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.attemptLogin = this.attemptLogin.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(userRegistered => {
      this.setState({user: userRegistered});
      const db = firebase.firestore();

      db.collection("notes")
        .orderBy("date", "desc")
        .where("madeBy", "==", this.state.user.uid)
        .get()
        .then(resolution => {
          resolution.docs.forEach(doc => {
            const newNotesMade = this.state.notesMade;
            newNotesMade.push(doc.data());
            this.setState({
              notesMade: newNotesMade,
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  attemptLogin() {
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).then(result => {
      console.log("I got into your site, Dan");
    })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const noteList = this.state.notesMade.map(note => 
      <li className="list-group-item">{ note.title }</li>
    );

    const isLoggedIn = 
      <div className="App container">
        <h3 className="dislay-3">Your Notes</h3>
        <ul className="list-group">
          { noteList }
        </ul>
      </div>

      const isntLoggedIn = 
        <div>
          <h4>You Gotta Log in.</h4>
          <input type="text" onChange={this.handleUsernameChange} />
          <input type="password" onChange={this.handlePasswordChange} />
          <button onClick={this.attemptLogin}>Log In</button>
        </div>

      if (!this.state.user) {
        return isntLoggedIn;
      } else {
        return isLoggedIn;
      }
  }
}

export default App;
