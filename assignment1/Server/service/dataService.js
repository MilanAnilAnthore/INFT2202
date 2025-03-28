import { MongoClient } from 'mongodb';

function dataService(collectionName) {
    const localUri = "mongodb://localhost:27017/";
    const dbName = "your_database_name"; // Add your database name
    const client = new MongoClient(localUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Add error handling
    client.connect().catch(err => {
        console.error('MongoDB Connection Error:', err);
    });

    const projection = {
        _id: 0,
        name: 1,
        description: 1,
        stock: 1,
        price: 1,
        user: 1,
        createTime: 1
    };

    return {
        delete: async (id = null) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                if (id == null) {
                    return await collection.deleteMany({});
                } else {
                    return await collection.deleteOne({ id });
                }
            } finally {
                await client.close();
            }
        },

        deleteByName: async (name) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                return await collection.deleteOne({ name });
            } finally {
                await client.close();
            }
        },

        add: async (product) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                product.createTime = Math.floor(Date.now() / 1000);
                product.user = 'your student id'; // Replace with actual student ID
                return await collection.insertOne(product);
            } finally {
                await client.close();
            }
        },

        update: async (id, product) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                return await collection.updateOne(
                    { id },
                    {
                        $set: {
                            name: product.name,
                            description: product.description,
                            stock: product.stock,
                            price: product.price
                        }
                    }
                );
            } finally {
                await client.close();
            }
        },

        updateByName: async (name, product) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                return await collection.updateOne(
                    { name },
                    {
                        $set: {
                            name: product.name,
                            description: product.description,
                            stock: product.stock,
                            price: product.price
                        }
                    }
                );
            } finally {
                await client.close();
            }
        },

        query: async (id) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                return await collection.findOne({ id }, { projection });
            } finally {
                await client.close();
            }
        },

        load: async ({ page = 1, perPage = 5 }) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);

                const total = await collection.countDocuments();
                const pages = Math.ceil(total / perPage);
                const skip = (page - 1) * perPage;

                const records = await collection
                    .find({}, { projection })
                    .skip(skip)
                    .limit(perPage)
                    .toArray();

                return {
                    records,
                    pagination: { page, perPage, pages, count: total }
                };
            } finally {
                await client.close();
            }
        },

        findByName: async (name) => {
            try {
                await client.connect();
                const database = client.db('assignment1');
                const collection = database.collection(collectionName);
                return await collection.findOne({ name }, { projection });
            } finally {
                await client.close();
            }
        }
    };
}

export default dataService;



