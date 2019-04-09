import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCw_DDfKRwiS7QTqOdvTaHx_zILpDFpLuw",
  authDomain: "takenote-b375b.firebaseapp.com",
  databaseURL: "https://takenote-b375b.firebaseio.com",
  projectId: "takenote-b375b",
  storageBucket: "takenote-b375b.appspot.com",
  messagingSenderId: "978893534539"
};

firebase.initializeApp(config);

export default firebase;