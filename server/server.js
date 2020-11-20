const express = require('express');
const io = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');
const PORT = 5000;

const {
	removeUser,
	addUser,
	getUserInRoom,
	getUser,
	users,
} = require('./user');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(router);

const server = http.createServer(app);

const socket = io(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

socket.on('connection', sockets => {
	console.log('We have a new connection!!!');

	sockets.on('join-room-chat', ({ nickname, color }, callback) => {
		const { user } = addUser({ id: sockets.id, name: nickname, color });
		console.log(user);

		sockets.broadcast.to('test-room').emit('res-message', {
			user: nickname,
			text: 'hello',
			color: user.color,
		});
		const error = true;

		sockets.join('test-room');
	});
	sockets.on('send-message', (message, callback) => {
		//	const user = getUser(sockets.id);
		//console.log(users, sockets.id);

		const user = users.find(u => u.id === sockets.id);

		// console.log(sockets.id, 1, users, message);
		if (user) {
			sockets.broadcast.to('test-room').emit('res-message', {
				user: user.name,
				text: message,
				color: user.color,
			});
		}
		callback({ color: user.color });
	});

	sockets.on('typing-on', () => {
		const user = users.find(u => u.id === sockets.id);
		if (user) {
			sockets.broadcast.to('test-room').emit('res-typing-on', {
				user: user.name,
				status: 'is typing',
				id: user.id,
				color: user.color,
			});
		}
	});
	sockets.on('typing-off', (a, callback) => {
		const user = users.find(u => u.id === sockets.id);

		if (user) {
			sockets.broadcast.to('test-room').emit('res-typing-off', {
				user: user.name,
				status: 'typing-off',
			});
		}
		callback(user);
	});

	sockets.on('disconnect', () => {
		console.log('User had left!!!');
	});
});

server.listen(PORT, () => console.log(`this is port ${PORT}`));
