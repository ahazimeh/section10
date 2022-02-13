import { MongoClient } from "mongodb";
import { connectDatabase, insertDocument } from "../../helpers/db-util";
// async function connectDatabase() {
//     const adminPassword = encodeURIComponent(process.env.password)
//     let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;

//     const client = await MongoClient.connect(url)
//     return client;
// }

// async function insertDocument(client, document) {
//     const db = client.db();
//     await db.collection('newsletter').insertOne(document);
// }
async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.body.email;
        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({ message: 'Invalid email address.' })
            return;
        }
        const adminPassword = encodeURIComponent(process.env.password)
        let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;

        let client;
        try {
            client = await connectDatabase()

        }
        catch (err) {
            res.status(500).json({ message: 'Connecting to the database failed!' })
            return
        }
        try {
            await insertDocument(client, 'newsletter', { email: userEmail })
            client.close()
        }
        catch (err) {
            res.status(500).json({ message: 'Inserting data failed!' })
            return;
        }

        console.log(userEmail)
        res.status(201).json({ message: 'Signed up!' })
    }
}
export default handler;