
import mongoose from 'mongoose';

const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb+srv://aldygnwan:aldy12345@clusteraldy.px0lpgk.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAldy', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'db_aldygnwan_betest'
          });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;
    }
};

export { connectToDatabase };