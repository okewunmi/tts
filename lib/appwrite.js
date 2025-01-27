import * as FileSystem from 'expo-file-system';
import mammoth from 'mammoth'; // For Word document text extraction

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Permission,
  Role,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.company.VoxifyApp",
  projectId: "6781ffea00354ecae5ca",
  databaseId: "678225de0029c6d82768",
  usersCollectionId: "6782270b0011ef9d63d9",
  documentCollectionId: "6782292f002ebedeac72",
  storageId: "67822e6200158bc006df",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  documentCollectionId,
  storageId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// **User Authentication**
export async function createUser(email, password) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
    );

    if (!newAccount || !newAccount.$id) {
  throw new Error("New account creation failed");
}

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        email: email,
        password: password,
        accountId: newAccount.$id,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function extractFileText(file) {
  try {
    const uri = file.uri;
    const mimeType = file.mimeType;

    switch (mimeType) {
      case 'application/pdf':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case'application/msword':
        return await FileSystem.readAsStringAsync(uri);
      default:
        return " ";
    }
  } catch (error) {
    console.error("Text extraction error:", error);
    return " ";
  }
}



export async function getFilePreview(fileId) {
  try {
    // Get a direct view URL for the file
    const fileUrl = storage.getFileView(
      config.storageId,
      fileId
    );

    // Ensure fileUrl is a valid string
    if (typeof fileUrl !== 'string' || fileUrl.length > 2000) {
      throw new Error('Invalid file URL');
    }

    return fileUrl;
  } catch (error) {
    throw new Error('Failed to get file preview');
  }
}

export async function uploadFile(file, type) {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    // Extract text (ensure this function works correctly)
    const extractedText = await extractFileText(file) || "";
    
    // Get the file URL directly
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

    return {
      fileUrl,
      extractedText
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error.message || 'File upload failed');
  }
}


// Create document record in database
export async function createDocument(file, userId, fileUrl) {
  try {
    const newDocument = await databases.createDocument(
      config.databaseId,
      config.documentCollectionId,
      ID.unique(),
      {
        title: file.name.replace(/\.[^/.]+$/, ""),
        fileUrl: fileUrl,
        createdAt: new Date().toISOString(),
        fileSize: file.size,
        language: "English",
        userId: userId,
        extractedText: file.extractedText || " " // Ensure non-empty string
      }
    );
    return newDocument;
  } catch (error) {
    throw new Error(error);
  }
}


// Get all documents for a user
export async function getDocuments(userId) {
  try {
    const documents = await databases.listDocuments(
      config.databaseId,
      config.documentCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"), // Sort by newest first
      ]
    );

    if (!documents) throw Error;

    return documents.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error(error);
  }
}

// Get a single document by ID
export async function getDocumentById(fileId) {
  try {
    const document = await databases.getDocument(
      config.databaseId,
      config.documentCollectionId,
      fileId
    );

    if (!document) throw Error;

    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error(error);
  }
}


// Delete a document
export async function deleteDocument(documentId, fileUrl) {
  try {
    // Extract file ID from the fileUrl
    const fileId = fileUrl.split('/').pop();
    
    // Delete file from storage
    await storage.deleteFile(
      config.storageId,
      fileId
    );

    // Delete document record from database
    await databases.deleteDocument(
      config.databaseId,
      config.documentCollectionId,
      documentId
    );

    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error(error);
  }
}
