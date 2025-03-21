import * as FileSystem from "expo-file-system";
import mammoth from "mammoth"; // For Word document text extraction
import * as ImageManipulator from "expo-image-manipulator";
import MlkitOcr from 'react-native-mlkit-ocr';
// import { recognizeText } from "react-native-text-detector";
import { captureRef } from "react-native-view-shot";
import ViewShot from "react-native-view-shot";
// import MLKitOcr from "react-native-mlkit-ocr";
import { Buffer as BufferPolyfill } from 'buffer';


import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Functions,
  InputFile
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
  TextExtraction: "text-extraction",
  pdfExtractFunctionId: '67d0b92d00230d006769',
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
const functions = new Functions(client);
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

export async function getFilePreview(fileId) {
  try {
    return storage.getFileView(config.storageId, fileId);
  } catch (error) {
    throw new Error("Failed to get file preview");
  }
}

// Upload Document
// export const uploadFile = async (file) => {
//   try {
//     console.log("File being uploaded:", JSON.stringify(file, null, 2));

//     const uploadedFile = await storage.createFile(
//       config.storageId,
//       ID.unique(),
//       file
//     );
//     if (!uploadedFile || !uploadedFile.$id) {
//       throw new Error("File upload failed");
//     }
//     const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id).href;
//     return { fileUrl, fileId: uploadedFile.$id };
//   } catch (error) {
//     throw new Error("Error uploading document: " + error);
//   }
// };
export const uploadFile = async (file) => {
  try {
    console.log("File being uploaded:", JSON.stringify(file, null, 2));
    
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    console.log("File info:", fileInfo);
    
    // React Native file handling for Appwrite
    const fileName = file.name || file.uri.split('/').pop();
    const mimeType = file.type || 'application/pdf'; // default to PDF if type is missing
    
    // Create a proper file input for Appwrite
    const fileInput = {
      name: fileName,
      type: mimeType,
      uri: file.uri,
      size: fileInfo.size
    };

    // When using Appwrite with React Native, you need to use the Input.file constructor
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
     fileInput
    );
    
    if (!uploadedFile || !uploadedFile.$id) {
      throw new Error("File upload failed");
    }
    
    console.log("File uploaded successfully. ID:", uploadedFile.$id);
    
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id).href;
    
    // Return both fileId AND storageId (bucketId)
    return { 
      fileUrl, 
      fileId: uploadedFile.$id,
      storageId: config.storageId // Add this to ensure we pass the correct bucketId
    };
  } catch (error) {
    console.error("Detailed upload error:", error);
    throw new Error("Error uploading document: " + error.message);
  }
};
// Create document record in database
export async function createDocument(file, userId, fileUrl,  extractedText) {
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
        extractedText: extractedText || "empty",
        docType: "Document",
      }
    );
    return newDocument;
  } catch (error) {
    throw new Error(error);
  }
}

// extractTextFromFile function
export const extractTextFromFile = async (file) => {
  try {
  
    // Validate file input
    if (!file || !file.name) {
      throw new Error("Invalid file object or missing filename");
    }
    
    console.log("Processing file:", file.name);
    console.log("File URI:", file.uri);
    
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    // Upload the file first - this is where the error likely occurs
    console.log("About to upload file...");
    const { fileUrl, fileId, storageId } = await uploadFile(file);
    console.log("File uploaded successfully. ID:", fileId, "URL:", fileUrl);
    
    // Default result
    let extractedText = "Text extraction not supported for this file type.";
    
    if (fileExtension === "pdf") {
      // Call Appwrite function to extract text
      const execution = await functions.createExecution(
        config.pdfExtractFunctionId,
        JSON.stringify
          fileId: fileId,
          storageId: storageId // Ensure this is passed correctly
        }),
        false
      );
      
      
      if (execution.status === 'completed' && execution.response) {
        const result = JSON.parse(execution.response);
        if (result.success && result.extractedText) {
          extractedText = result.extractedText;
        } else {
          extractedText = "PDF text extraction failed.";
        }
      }
    } else if (fileExtension === "docx" || fileExtension === "doc") {
      try {
        // Ensure the file URI is accessible
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (!fileInfo.exists) {
          console.log("File not found at URI:", file.uri);
          throw new Error("Could not find file in options");
        }
        
        console.log("File exists at URI, attempting to read data");
        
        // Read file as binary/arraybuffer instead of base64
        const fileData = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Make sure we got data
        if (!fileData) {
          throw new Error("Failed to read file data");
        }

        console.log("Successfully read file data, length:", fileData.length);
        
        // Create a buffer from the base64 string
        const buffer = BufferPolyfill.from(fileData, "base64");
        
        // Try the alternative approach for mammoth
        const result = await mammoth.extractRawText({ 
          arrayBuffer: buffer.buffer 
        });
        
        extractedText = result.value || "No text extracted";
        
        if (result.messages && result.messages.length > 0) {
          console.log("Mammoth messages:", result.messages);
        }
      } catch (docError) {
        console.error("DOCX extraction error:", docError);
        
        // Fallback to server-side extraction if available
        try {
          const functions = new Functions(client);
          const execution = await functions.createExecution(
            config.docExtractFunctionId, // You would need this function on your server
            JSON.stringify({
              fileId: fileId,
              storageId: config.storageId
            }),
            false,
            '',
            ''
          );
          
          if (execution && execution.status === 'completed' && execution.response) {
            const result = JSON.parse(execution.response);
            if (result.success && result.extractedText) {
              extractedText = result.extractedText;
            } else {
              extractedText = "DOCX server extraction failed.";
            }
          } else {
            extractedText = "Failed to extract text from DOCX: " + docError.message;
          }
        } catch (serverError) {
          extractedText = "Failed to extract text from DOCX: " + docError.message;
        }
      }
    }
    
    // Return both the extracted text and file information
    return { 
      extractedText, 
      fileUrl,
      fileId
    };
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error("Text extraction failed: " + error.message);
  }
};

// const extractTextFromFile = async (file) => {
//   try {
//     const fileExtension = file.name.split(".").pop().toLowerCase();

//     if (fileExtension === "pdf") {
//       // Read file content as base64
//       const fileUri = file.uri;
//       const base64 = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Load PDF document
//       const pdfDoc = await PDFDocument.load(base64);
//       const text = (await pdfDoc.getText()) || "No text extracted";
//       return text;
//     }

//     if (fileExtension === "docx") {
//       // Read DOCX as binary
//       const fileUri = file.uri;
//       const fileData = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Convert binary to text
//       const { value } = await mammoth.extractRawText({ buffer: Buffer.from(fileData, "base64") });
//       return value || "No text extracted";
//     }

//     return "Text extraction not supported for this file type.";
//   } catch (error) {
//     console.error("Error extracting text:", error);
//     return "Text extraction failed.";
//   }
// };
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
      throw new Error("Text ID is required");
    }

    console.log("Fetching text with ID:", txtId); // Debug log

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

// Updated scanPhoto function
export async function scanPhoto(imageUri, extractedText) {
  try {
    // Validate image
    if (!imageUri || !(await FileSystem.getInfoAsync(imageUri)).exists) {
      throw new Error("Invalid image file");
    }

    // Process image (resize for efficiency)
    const processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Extract text if not already provided
    if (!extractedText) {
      const result = await MlkitOcr.detectFromUri(processedImage.uri);
      extractedText = result.map((block) => block.text).join("\n").trim();
    }

    if (!extractedText) {
      throw new Error("No text detected in image");
    }

    // Clean extracted text
    const cleanText = extractedText
      .replace(/[^\w\s.,!?\-@#$%^&*()]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Save to database (replace with your own database logic)
    return await databases.createDocument(
      config.databaseId,
      config.scanCollectionId,
      ID.unique(),
      {
        extractedText: cleanText,
        createdAt: new Date().toISOString(),
        docType: "Scan",
      }
    );
  } catch (error) {
    console.error("Scan error:", error);
    throw new Error(`Scan failed: ${error.message}`);
  }
}