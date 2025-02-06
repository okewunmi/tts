import * as FileSystem from "expo-file-system";
import mammoth from "mammoth"; // For Word document text extraction
import * as ImageManipulator from "expo-image-manipulator";
import { recognizeText } from "react-native-text-detector";
// import * as pdfjsLib from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";
// Import the base-64 decoder if necessary
import { decode as atob } from "base-64";
// Set the worker source for pdfjs-dist (important for Expo)
// pdfjsLib.getDocument.setWorkerSrc(
//   `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
// );


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
  Functions,
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
export async function uploadFile(file, type) {
  if (!file) throw new Error("No file provided");

  try {
    // Read file content as base64
    const base64Content = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Upload file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      new File([base64Content], file.name, { type: file.mimeType })
    );

    // Get file URL
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

    return {
      fileUrl: fileUrl.toString(),
      extractedText: "", // Text extraction will be handled separately
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function extractFileText(file) {
  try {
    const { uri, mimeType } = file;

    if (!uri || !mimeType) {
      throw new Error("Invalid file object");
    }

    let extractedText = "";

    // Handle PDF files
    if (mimeType === "application/pdf") {
      extractedText = await extractPdfText(uri);
    }
    // Handle DOCX files
    else if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      extractedText = await extractDocxText(uri);
    }
    // Handle images (if needed)
    else if (mimeType.startsWith("image/")) {
      extractedText = await extractImageText(uri);
    } else {
      throw new Error("Unsupported file type");
    }

    return extractedText || " "; // Ensure non-empty string
  } catch (error) {
    console.error("Text extraction error:", error);
    throw new Error(`Text extraction failed: ${error.message}`);
  }
}

// Utility to convert a base64 string to a Uint8Array
const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
// Helper function to extract text from PDFs using react-native-pdf-extractor
// const extractPdfText = async (uri) => {
//   try {
//     // Load the PDF file
//     const pdfDoc = await PDFDocument.load(uri);

//     // Extract text from each page
//     let extractedText = "";
//     for (let i = 0; i < pdfDoc.getPageCount(); i++) {
//       const page = pdfDoc.getPage(i);
//       extractedText += await page.getTextContent();
//     }

//     return extractedText;
//   } catch (error) {
//     console.error("PDF extraction error:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// };
// const extractPdfText = async (uri) => {
//   try {
//     const response = await fetch(uri); // For remote URIs, fetch is required
//     const typedarray = await response.arrayBuffer(); // Get the ArrayBuffer

//     const pdf = await pdfjsLib.getDocument(typedarray).promise;
//     let extractedText = "";

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map((item) => item.str).join(" ");
//       extractedText += pageText + "\n";
//     }

//     return extractedText;
//   } catch (pdfError) {
//     console.error("PDF processing error:", pdfError);
//     throw new Error("Failed to process PDF content.");
//   }
// };
const extractPdfText = async (uri) => {
  try {
    // Read file content as base64 (ensure the file is local or accessible via FileSystem)
    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 string into a Uint8Array (binary data)
    const pdfData = base64ToUint8Array(base64Content);

    // Load the PDF document using the binary data
    const pdf = await getDocument({ data: pdfData }).promise;

    let extractedText = "";
    // Iterate through each page and extract text
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items.map((item) => item.str).join(" ");
      extractedText += pageText + "\n";
    }

    return extractedText;
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};


// Helper function to extract text from DOCX files
const extractDocxText = async (uri) => {
  try {
    const base64Content = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = base64ToArrayBuffer(base64Content);
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.replace(/\n{3,}/g, "\n\n"); // Cleanup excessive newlines
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};

// Helper function to extract text from images
const extractImageText = async (uri) => {
  try {
    const processedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    const extractedText = await recognizeText({
      imagePath: processedImage.uri,
      detectType: "text",
      language: "eng",
    });

    return extractedText
      .map((item) => item.text)
      .join("\n")
      .replace(/[^\w\s.,!?\-@#$%^&*()]/g, "") // Remove special chars
      .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
      .trim();
  } catch (error) {
    console.error("Image OCR error:", error);
    throw new Error("Failed to extract text from image");
  }
};

// Helper function to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

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
export async function scanPhoto(uri) {
  try {
    const currentUser = await getCurrentUser();

    // Validate image
    if (!uri || !(await FileSystem.getInfoAsync(uri)).exists) {
      throw new Error("Invalid image file");
    }

    // Process image
    const processedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Extract text
    const extractedText = await recognizeText({
      imagePath: processedImage.uri,
      detectType: "text",
      language: "eng",
    });

    // Process results
    if (!extractedText?.length) {
      throw new Error("No text detected in image");
    }

    const cleanText = extractedText
      .map((item) => item.text)
      .join("\n")
      .replace(/[^\w\s.,!?\-@#$%^&*()]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Create document
    return await databases.createDocument(
      config.databaseId,
      config.scanCollectionId,
      ID.unique(),
      {
        userId: currentUser.$id,
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
