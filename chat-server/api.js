
const {Messages, Users} = require('./database')

const express = require("express"),
	app = express(),
	PORT = 80

const cors = require('cors');
app.use(cors());

const http = require('http').createServer(app),
	io = require('socket.io')(http, {
		cors: {
			origin: '*',
			methods: ["GET", "POST"],
		},
	})

io.on('connection', (socket) => {

	socket.on('message', async (message) => {
		switch (message.type) {
			case 'init':
				let { user_id } = message

				Users.findOne({user_id: user_id}, async (err, user) => {
					if (!user) {
						user_id = await Users.count() + 1

						Users.collection.insertOne({
							user_id: user_id.toString(),
							messages: []
						})
					}

					Messages.find({})
					.sort('time')
					.populate({
						path: 'users',
						select: {user_id: 1, _id: 0},
					})
					.exec((err, messages) => {
						const allMessages = messages.slice(0, 100).map((msg) => {
							return {user_id: msg.users.user_id, message: msg.message, time: msg.time}
						})
						socket.send({...message, msg: "Вы подключились к чату", status: true, user_id: user_id, messages: allMessages})
					})

					socket.local.emit('message', {type: 'new_user', msg: "Successfully connected"})
				})
				break

		}
	})

	socket.on('dialog-new-message', async (event) => {
		const {message, user_id} = event

		const user = await Users.findOne({user_id: user_id})
		if (user) {
			const messageOptions = {
				users: user._id,
				message: message,
				time: Date.now() + 7*24*60*60*1000
			}
			const field = await Messages.collection.insertOne(messageOptions)

			await Users.findOneAndUpdate({user_id: user_id}, {
				$push: {messages: field.insertedId}
			})

			io.sockets.emit('dialog-update', {...messageOptions, user_id})
		}
	})

	socket.on('disconnect', () => {
	})
})

http.listen(PORT, '127.0.0.1',() =>
	console.log(`Server listens http://localhost:${PORT}`)
)