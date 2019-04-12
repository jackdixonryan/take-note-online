import React, { Component } from 'react';
import firebase from './components/firebase';
import CalendarDatePicker from './components/CalendarDate';
// import Calendar from 'rc-calendar';
// import 'rc-calendar/assets/index.css';

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

  // our mounted hook. Very straightforward. Getting the user from auth, waiting for the uid, hitting the firestore, filtering notes by user, grabbing only the notes that user made, and sending them in descending order.
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

  // two bindings. In Vue this would warrant no comment. 
  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  // fires the firebase auth with the bound email and password variables.
  attemptLogin() {
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).then(result => {
      console.log("I got into your site, Dan");
    })
      .catch(error => {
        console.log(error);
      });
  }

  // creates a legible date for the user, same as in the extension.
  daysBetweenNowAndThen = unixTimestamp => {
    const javascriptDate = new Date(unixTimestamp.seconds * 1000);
  
    const dayOfEntry = javascriptDate.getDate();
    
    const now = new Date();
    const today = now.getDate();
  
    const daysBetween = today - dayOfEntry;
    if (daysBetween === 0) {
      return `Today`;
    } else if (daysBetween === 1) {
      return `Yesterday`;
    } else if (daysBetween < 0) {
      return `${javascriptDate.getMonth()}/${javascriptDate.getDate()}`;
    } else {
      return `${daysBetween} days ago`;
    }
  }

  returnLegibleDate = unixTimestamp => {
    const javascriptDate = new Date(unixTimestamp.seconds * 1000);
    const day = javascriptDate.getDate();
    const month = javascriptDate.getMonth();

    return `${month}.${day}`
  }

  render() {
    const noteList = this.state.notesMade.map(note => 
      <a className="list-group-item list-group-item-action" href={ note.url }>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1 left">{ note.title }</h5>
          <small>{ this.daysBetweenNowAndThen(note.date) }</small>
        </div>
        <p className="mb-1 left">{ note.userComments }</p>
      </a>
    );

    const isLoggedIn = 
      <div className="App">
        <h3 className="display-3">Your Notes</h3>
        <div className="list-group">
          { noteList }
        </div>
        <CalendarDatePicker />
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
