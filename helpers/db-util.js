export async function connectDatabase() {
    const adminPassword = encodeURIComponent(process.env.password)
    let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;

    const client = await MongoClient.connect(url)
    return client;
}

export async function insertDocument(client, collection, document) {
    const db = client.db();
    await db.collection(collection).insertOne(document);
}