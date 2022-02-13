import { MongoClient } from "mongodb";
export async function connectDatabase() {
    const adminPassword = encodeURIComponent(process.env.password)
    let url = `mongodb+srv://root:${adminPassword}@cluster0.svlvw.mongodb.net/events?retryWrites=true&w=majority`;

    const client = await MongoClient.connect(url)
    return client;
}

export async function insertDocument(client, collection, document) {
    console.log("a")
    const db = client.db();
    console.log("b")
    const result = await db.collection(collection).insertOne(document);
    console.log("c")
    return result;
}

export async function getAllDocuments(client, collection, sort) {
    const db = client.db();
    const documents = await db
        .collection(collection)
        .find()
        .sort(sort)
        .toArray();
    return documents
}