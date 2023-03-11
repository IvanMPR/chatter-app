# Chatter-app
<br>

### Real time chat application hosted on render.com

<br>
<a href="https://chatter-app-cb20.onrender.com/">Live demo</a>
<br>
<br>

<img width="100%" src="./public/img/screenshot.jpg">
<br>


#### Brief description

Real time chat app, built around Node.js server with Socket.io library for handling client/server communication.

App can register user connections, disconnections, username edit and communication between all clients

List of active users is displayed in the left part of the app screen and updated according to connections

#### Tech
Node.js, Express, Socket.io, HTML, CSS, JavaScript

Short delays might occur, especially with active users list update and automated messages display in messages area. 
Most likely, this happens due to the latency issues with render hosting service where the app is hosted in free tier.
