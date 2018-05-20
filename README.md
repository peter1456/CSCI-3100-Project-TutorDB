# TutorDB

## Background
It is a web application created for the group project in the software engineering course CSCI3100 in CUHK. I write the code in this app's backend, and the chat page in this app's frontend.

## Introduction to the application 
A web application aiming to provide a platform for tutors and student to pair up themselves. 

## Technology used 
- JQuery, vanilla JS, CSS templates from w3schools are used for the development of front end
- Node.js with the framework Express is used for the development of server
- The middleware Passport is used for the authentication of accounts
- Socket.io is used to implement the real-time chat
- MongoDB with the node.js module Mongoose is used for the database

## Functionalities
- Two different kinds of account: Student and Tutor
- Search function to allow student / tutors to search the desired tutor / student
- Chat function allowing them to discuss the details of tutorials in real time
- A system to confirm the establishment of student-tutor relationship
- Rating system to let the student rate their tutors. Tutor's rating will be visible to public 