let mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/chat', {
    socketTimeoutMS: 10000
}, () => {console.log(1)});

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

let Schema = mongoose.Schema;

let UsersSchema = new Schema({
    user_id: {type: String, required: true},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Messages"}],
})

let MessagesSchema = new Schema({
    users: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    message: {type: String, required: true},
    time: {type: Number, required: true, default: Date.now() + 7*24*60*60*1000},
})

let Messages = mongoose.model('Messages', MessagesSchema);
let Users = mongoose.model('Users', UsersSchema);

module.exports = {Users, Messages};
