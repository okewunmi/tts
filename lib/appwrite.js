import * as FileSystem from "expo-file-system";
import mammoth from "mammoth"; // For Word document text extraction
import { Extractor, Patterns } from 'react-native-pdf-extractor';
import { decode } from 'base64-js';
import * as ImageManipulator from 'expo-image-manipulator';
import { recognizeText } from 'react-native-text-detector';

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
  textCollectionId: "6797305700168882224d",
  webCollectionId: "67980e18003da84092ef",
  scanCollectionId: "679aa917001990138b97",
  storageId: "67822e6200158bc006df",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  documentCollectionId,
  webCollectionId,
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
    const newAccount = await account.create(ID.unique(), email, password);

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
    const { uri, mimeType } = file;
    
    if (!uri || !mimeType) {
      console.error('Invalid file object:', file);
      return " ";
    }

    switch (mimeType) {
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        try {
          const base64Content = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          if (!base64Content) {
            console.error('Empty base64 content');
            return " ";
          }
          
          const arrayBuffer = base64ToArrayBuffer(base64Content);
          const result = await mammoth.extractRawText({ arrayBuffer });
          return result.value.replace(/\n{3,}/g, '\n\n'); // Cleanup excessive newlines
        } catch (docError) {
          console.error('DOCX processing error:', docError);
          return " ";
        }

      case "application/pdf":
        try {
          const pdfText = await extractPdfText(uri);
          return pdfText || " "; // Ensure non-empty string
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError);
          return " ";
        }

      default:
        console.warn('Unsupported file type:', mimeType);
        return " ";
    }
  } catch (error) {
    console.error("Text extraction error:", error);
    return " ";
  }
}

const base64ToArrayBuffer = (base64) => {
  try {
    const bytes = decode(base64);
    return bytes.buffer;
  } catch (error) {
    console.error('Base64 conversion error:', error);
    throw new Error('Failed to convert base64 to ArrayBuffer');
  }
};

const extractPdfText = (uri) => {
  return new Promise((resolve, reject) => {
    if (!uri) {
      reject(new Error('Invalid PDF URI'));
      return;
    }

    let timeout = setTimeout(() => {
      reject(new Error('PDF text extraction timeout'));
    }, 1200000);

    const extractionCallback = (data) => {
      clearTimeout(timeout);
      if (data?.text?.length > 0) {
        resolve(data.text.join('\n').trim());
      } else {
        reject(new Error('No text found in PDF'));
      }
    };

    // Use the Extractor component properly
    // Note: This should be rendered in a component context
    // Consider alternative PDF extraction approach if this doesn't work
    <Extractor
      key={uri} // Force re-render for new URIs
      onResult={extractionCallback}
      onError={(error) => {
        clearTimeout(timeout);
        reject(error);
      }}
      patterns={[/[\s\S]*/g]}
      uri={uri}
    />;
  });
};

// export async function extractFileText(file) {
//   try {
//     const uri = file.uri;
//     const mimeType = file.mimeType;

//     switch (mimeType) {
//       case "application/pdf":
//       case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//       case "application/msword":
//         return await FileSystem.readAsStringAsync(uri);
//       default:
//         return " ";
//     }
//   } catch (error) {
//     console.error("Text extraction error:", error);
//     return " ";
//   }
// }

export async function getFilePreview(fileId) {
  try {
    // Get a direct view URL for the file
    const fileUrl = storage.getFileView(config.storageId, fileId);

    // Ensure fileUrl is a valid string
    if (typeof fileUrl !== "string" || fileUrl.length > 2000) {
      throw new Error("Invalid file URL");
    }

    return fileUrl;
  } catch (error) {
    throw new Error("Failed to get file preview");
  }
}

// upload file
// export async function uploadFile(file, type) {
//   if (!file) return;
//   const { mimeType, ...rest } = file;
//   const asset = { type: mimeType, ...rest };
//   try {
//     const uploadedFile = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       asset
//     );

//     // Extract text using updated logic
//     const extractedText = await extractFileText(file);

//     // Store extracted text in Appwrite database
//     const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);
//     return { fileUrl, extractedText };
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw new Error(error.message || "File upload failed");
//   }
// }


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

    // Verify file view URL
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);
    if (!fileUrl) throw new Error("Failed to generate file URL");
  // Extract text using updated logic
    // const extractedText = await extractFileText(file);
// Text extraction with timeout
    const extractedText = await Promise.race([
      extractFileText(file),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Text extraction timeout")), 15000)
      )
    ]);
    // Store extracted text in Appwrite database
    // const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);
    return { fileUrl, extractedText };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error.message || "File upload failed");
  }
}


// export async function uploadFile(file, type) {
//   if (!file) return;
//   const { mimeType, ...rest } = file;
//   const asset = { type: mimeType, ...rest };
//   try {
//     const uploadedFile = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       asset
//     );

//     // Extract text (ensure this function works correctly)
//     const extractedText = (await extractFileText(file)) || "";

//     // Get the file URL directly
//     const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

//     return {
//       fileUrl,
//       extractedText,
//     };
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw new Error(error.message || "File upload failed");
//   }
// }

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
        extractedText: file.extractedText || " ", // Ensure non-empty string
        docType: "Document",
      }
    );
    return newDocument;
  } catch (error) {
    throw new Error(error);
  }
}
// Create document record in database
export async function createtext(text, userId) {
  try {
    const newText = await databases.createDocument(
      config.databaseId,
      config.textCollectionId,
      ID.unique(),
      {
        text,
        createdAt: new Date().toISOString(),
        userId: userId,
        docType: "Text",
      }
    );
    return newText;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createUrl(link, userId) {
  try {
    const newText = await databases.createDocument(
      config.databaseId,
      config.webCollectionId,
      ID.unique(),
      {
        createdAt: new Date().toISOString(),
        userId: userId,
        docType: "Web",
        link,
      }
    );
    return newText;
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

export async function getTextById(txtId) {
  try {
     if (!txtId) {
      throw new Error('Text ID is required');
    }

    console.log('Fetching text with ID:', txtId); // Debug log

    const document = await databases.getDocument(
      config.databaseId,
      config.textCollectionId,
      txtId
    );

    if (!document) throw Error;

    return document;
  } catch (error) {
    console.error("Error fetching text:", error.message);
    throw new Error(error);
  }
}

export async function getWebById(urlId) {
  try {
    const document = await databases.getDocument(
      config.databaseId,
      config.webCollectionId,
      urlId
    );

    if (!document) throw Error;

    return document;
  } catch (error) {
    console.error("Error fetching url:", error);
    throw new Error(error);
  }
}

// Delete a document
export async function deleteDocument(documentId, fileUrl) {
  try {
    // Extract file ID from the fileUrl
    const fileId = fileUrl.split("/").pop();

    // Delete file from storage
    await storage.deleteFile(config.storageId, fileId);

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

// First, create functions to fetch from each collection
export async function getAllUserContent(userId) {
  try {
    // Fetch from multiple collections in parallel
    const [documents, texts, webs] = await Promise.all([
      databases.listDocuments(config.databaseId, config.documentCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
      ]),
      databases.listDocuments(config.databaseId, config.textCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
      ]),
      databases.listDocuments(config.databaseId, config.webCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
      ]),
    ]);

    // Combine and add docType to each item
    return [
      ...documents.documents.map((doc) => ({ ...doc, docType: "Document" })),
      ...texts.documents.map((text) => ({ ...text, docType: "Text" })),
      ...webs.documents.map((web) => ({ ...web, docType: "Web" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching content:", error);
    throw new Error(error);
  }
}

export async function scanPhoto(uri){
  try {
     const currentUser = await getCurrentUser(); 
    
    // 1. Take picture
    const { uri } = await takePictureAsync({
      quality: 0.8,
      base64: false,
    });

    // 2. Process image
    const processedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 3. Extract text using react-native-text-detector
    const extractedText = await recognizeText({
      imagePath: processedImage.uri,
      detectType: 'text',
      language: 'eng',
    });

    // 4. Clean and format extracted text
    const combinedText = extractedText
      .map(item => item.text)
      .join('\n');

    const cleanText = combinedText
      .replace(/[^\w\s.,!?\-@#$%^&*()]/g, '') // Remove special chars
      .replace(/\n{3,}/g, '\n\n')            // Reduce multiple newlines
      .trim();

    if (!cleanText) throw new Error("No readable text found after cleaning");

    // 5. Store cleaned text in Appwrite
    const document = await databases.createDocument(
      config.databaseId,
      config.scanCollectionId,
      ID.unique(),
      {
        userId:currentUser.$id,
        extractedText: cleanText, // Store cleaned text
        createdAt: new Date().toISOString(),
      }
    );

    return document;
  } catch (error) {
    console.error("Scan error:", error);
    throw new Error(error.message || "Photo scanning failed");
  }
};