const Localbase = require("localbase").default;
let db = new Localbase(process.env.LOCALBASE_NAME);

console.log("hhhhhhhh", db);

async function checkCollection(collectionName) {
  let collectionExists = false;

  // Try to get a document from the collection
  const doc = await db.collection(collectionName).get();

  // If the document exists, then the collection exists
  if (doc.length) {
    collectionExists = true;
  }

  return collectionExists;
}

export default function saveKey() {
  const checkCollectionfunction = async (collectionname, data) => {
    checkCollection(collectionname).then((collectionExists) => {
      if (!collectionExists) {
        // Create the collection by adding a document

        const jsonData = JSON.parse(JSON.stringify(data));
        db.collection(collectionname).add({
          id: 1,
          data: jsonData,
        });
      } else {
        console.log("Collection already exists");
      }
    });
  };

  const resetDb = async () => {
    await db.delete();
  };

  async function getCollectionData(collectionName) {
    // Get all documents from the collection
    const docs = await db.collection(collectionName).get();

    return docs;
  }

  function deleteDocsByKeyValue(collectionName, key, value) {
    console.log("je supprime ça ", collectionName, key, value);

    return db
      .collection(collectionName)
      .get()
      .then((documents) => {
        let deletePromises = [];

        documents.forEach((doc) => {
          if (doc[key] === value) {
            console.log("yes", doc);
            let deletePromise = db
              .collection(collectionName)
              .doc({ [key]: value })
              .delete();
            deletePromises.push(deletePromise);
          }
        });

        return Promise.all(deletePromises);
      })
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du document : ", error);
        return false;
      });
  }

  async function getCollectionData(collectionName) {
    // Get all documents from the collection
    const docs = await db.collection(collectionName).get();

    // Add the database key to each document
    const data = docs.map((doc) => {
      return {
        ...doc,
        key_db: doc.key,
      };
    });

    return data;
  }

  async function addObjectIfNotExists(collectionName, key, value, newObject) {
    console.log("je chserche dans ", collectionName);
    console.log("si  il y a un objet qui a la valeur", value);
    console.log("dans sa clé", key);
    console.log("avant de l enregistrer", newObject);
    // Get all documents from the collection
    const docs = await db.collection(collectionName).get();

    // Check if a document with the specified key value exists
    const exists = docs.some((doc) => doc[key] === value);

    if (!exists) {
      // If the document doesn't exist, add the new object to the collection
      console.log("No ça n existe pas ");
      const jsonData = JSON.parse(JSON.stringify(newObject));
      await db.collection(collectionName).add(jsonData);
      return true;
    } else {
      console.log("An object with the same key value already exists");
      return false;
    }
  }

  return {
    checkCollectionfunction,
    resetDb,
    getCollectionData,
    addObjectIfNotExists,
    deleteDocsByKeyValue,
  };
}
