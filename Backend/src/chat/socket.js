const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'plataforma_practicas';

let db;

async function connectMongo() {
  if (!db) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

function socketModule(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    // Unirse a una sala por su userId
    socket.join(socket.user.id.toString());

    // Enviar mensaje
    socket.on('send_message', async (data) => {
      const { to, text } = data;
      const from = socket.user.id;
      const db = await connectMongo();
      // Buscar o crear chat
      let chat = await db.collection('chats').findOne({ users: { $all: [from, to] } });
      if (!chat) {
        const chatDoc = {
          users: [from, to],
          lastMessage: { text, sender: from, timestamp: new Date() },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await db.collection('chats').insertOne(chatDoc);
        chat = { ...chatDoc, _id: result.insertedId };
      } else {
        await db.collection('chats').updateOne(
          { _id: chat._id },
          { $set: { lastMessage: { text, sender: from, timestamp: new Date() }, updatedAt: new Date() } }
        );
      }
      // Guardar mensaje
      const message = {
        chatId: chat._id,
        sender: from,
        receiver: to,
        text,
        read: false,
        timestamp: new Date()
      };
      await db.collection('messages').insertOne(message);
      // Emitir al receptor si está conectado
      io.to(to.toString()).emit('receive_message', { ...message, chatId: chat._id });
      // Emitir al emisor para confirmación
      socket.emit('message_sent', { ...message, chatId: chat._id });
    });
  });

  return io;
}

module.exports = socketModule; 