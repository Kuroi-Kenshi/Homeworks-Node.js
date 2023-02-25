import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/my-courses');

export const connectToMongoDB = () => {
    const db = mongoose.connection;

    db.on('error', err => console.error(err.message));
    db.once('open', () => console.info("Connected to MongoDB!"));
}
