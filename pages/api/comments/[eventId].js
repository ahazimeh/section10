import { MongoClient } from "mongodb";
import { connectDatabase, insertDocument } from "../../../helpers/db-util"
async function handler(req, res) {
    const eventId = req.query.eventId;
    const adminPassword = encodeURIComponent(process.env.password)
    let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;

    const client = await MongoClient.connect(url)
    if (req.method === 'POST') {
        const { email, name, text } = req.body;
        console.log(req.body)
        if (!email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !text ||
            text.trim() === ''
        ) {
            res.send(422).json({ message: 'Invalid input.' })
            return;
        }
        const newComment = {
            // id: new Date().toISOString(),
            email,
            name,
            text,
            eventId
        }

        const db = client.db()

        const result = await db.collection('comments').insertOne(newComment);

        console.log(result);
        newComment.id = result.insertedId;
        res.status(201).json({ message: 'Added comment.', comment: newComment });
    }
    else if (req.method === 'GET') {
        // const dummyList = [
        //     { id: 'c1', name: 'Max', text: 'A first comment!' },
        //     { id: 'c2', name: 'Manuel', text: 'A second comment!' },
        // ]
        const db = client.db();
        const documents = await db
            .collection('comments')
            .find()
            .sort({ _id: -1 })
            .toArray();
        res.status(200).json({ comments: documents })
    }
    client.close()
}
export default handler;