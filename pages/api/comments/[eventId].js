import { MongoClient } from "mongodb";
import { connectDatabase, insertDocument, getAllDocuments } from "../../../helpers/db-util"
async function handler(req, res) {
    const eventId = req.query.eventId;
    const adminPassword = encodeURIComponent(process.env.password)
    let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;
    let client
    try {
        client = await connectDatabase()
    } catch (e) {
        res.status(500).send({ message: 'Connecting to the database failed' })
        return;
    }
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
            client.close()
            return;
        }
        const newComment = {
            // id: new Date().toISOString(),
            email,
            name,
            text,
            eventId
        }
        let result
        try {
            result = await insertDocument(client, 'comments', newComment)
            newComment._id = result.insertedId;
            res.status(201).json({ message: 'Added comment.', comment: newComment });
        } catch (error) {
            res.send(500).json({ message: 'Inserting comment failed!' })
        }

    }
    else if (req.method === 'GET') {
        try {
            const documents = await getAllDocuments(client, 'comments', { _id: -1 });
            res.status(200).json({ comments: documents })
        }
        catch (e) {
            res.send(500).json({ message: 'Getting comments failed' })
        }
    }
    client.close()
}
export default handler;