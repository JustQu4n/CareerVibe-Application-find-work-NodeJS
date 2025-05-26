// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../config/taskmanagement-10f8c-firebase-adminsdk-oyztp-8b6085d38e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'taskmanagement-10f8c.appspot.com' // Thay bằng bucket của bạn
});

const bucket = admin.storage().bucket();

module.exports = bucket;
