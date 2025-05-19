import * as FileSystem from "expo-file-system";
import mammoth from "mammoth"; // For Word document text extraction
import * as ImageManipulator from "expo-image-manipulator";
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
export async function createDocument(file, userId, fileUrl, extractedText) {
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

export const extractTextFromFile = async (file) => {
  try {
    if (!file || !file.name) {
      throw new Error("Invalid file object or missing filename");
    }

    // console.log("Processing file:", file.name);
    // console.log("File URI:", file.uri);

    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Upload to your storage (e.g., Appwrite) — unchanged
    const { fileUrl, fileId, storageId } = await uploadFile(file);
    // console.log("File uploaded to Appwrite. ID:", fileId);

    let extractedText = "Text extraction not supported for this file type.";

    if (fileExtension === "pdf") {
      try {
        // Read the file as base64
        // console.log("Reading PDF file as base64...");
        const pdfBase64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (!pdfBase64) {
          throw new Error("Failed to read PDF file - empty content");
        }

        console.log("Sending to Hugging Face Space...");
        const response = await fetch("https://seawolf2357-pdf-text-extractor.hf.space/run/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            data: [
              {
                "name": file.name,
                "data": `data:application/pdf;base64,${pdfBase64}`
              }
            ]
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error("API Error Response:", errorBody);
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        // console.log("API Response:", result);

        if (result && result.data) {
          extractedText = result.data[0] || "No text could be extracted";
          console.log("PDF text extraction successful.");
        } else {
          extractedText = "No text could be extracted from the PDF.";
          console.log("Unexpected response format:", result);
        }

      } catch (error) {
        console.error("PDF text extraction error:", error);
        extractedText = "Failed to extract text from PDF: " + error.message;
      }
    }
    // DOCX support (unchanged)
    else if (fileExtension === "docx" || fileExtension === "doc") {
      try {
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (!fileInfo.exists) {
          throw new Error("Could not find file in options");
        }

        const fileData = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const buffer = BufferPolyfill.from(fileData, "base64");

        const result = await mammoth.extractRawText({ arrayBuffer: buffer.buffer });

        extractedText = result.value || "No text extracted";

        if (result.messages?.length) {
          console.log("Mammoth messages:", result.messages);
        }
      } catch (docError) {
        console.error("DOCX extraction error:", docError);
        extractedText = "Failed to extract text from DOCX: " + docError.message;
      }
    }

    return {
      extractedText,
      fileUrl,
      fileId,
    };
  } catch (error) {
    console.error("Text extraction failed:", error);
    throw new Error("Text extraction failed: " + error.message);
  }
};



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

export async function createScanDoc(userId, imgUrl, extractedText) {
  try {
    const newDocument = await databases.createDocument(
      config.databaseId,
      config.scanCollectionId,
      ID.unique(),
      {
        userId,
        extractedText: extractedText || "empty",
        createdAt: new Date().toISOString(),
        imgUrl: imgUrl,
        docType: "Scan",
      }
    );
    return newDocument;
  } catch (error) {
    throw new Error(error);
  }
}

// export const scanImages = async ({ imageUris, userId }) => {
//   const extractedTexts = [];
//   const uploadedImageUrls = [];
//   const scanResults = [];

//   // Supported image formats and their MIME types
//   const SUPPORTED_FORMATS = {
//     jpg: 'jpeg',
//     jpeg: 'jpeg',
//     png: 'png',
//     gif: 'gif',
//     bmp: 'bmp',
//     webp: 'webp'
//   };

//   for (const [index, imageUri] of imageUris.entries()) {
//     let processedImage = null;
//     let originalExtension = '';
//     try {
//       console.log(`Processing image ${index + 1}/${imageUris.length}: ${imageUri}`);

//       // 1. Verify image exists and get file extension
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);
//       if (!fileInfo.exists) {
//         throw new Error(`Image file not found at URI: ${imageUri}`);
//       }

//       // Extract file extension
//       const uriParts = imageUri.split('.');
//       originalExtension = uriParts[uriParts.length - 1].toLowerCase();
//       const mimeType = SUPPORTED_FORMATS[originalExtension] || 'jpeg';

//       // 2. Process image (resize for better OCR performance)
//       try {
//         const actions = [{ resize: { width: 1200 } }];
//         const saveOptions = {
//           compress: 0.7,
//           format: ImageManipulator.SaveFormat.JPEG,
//           base64: false
//         };

//         processedImage = await ImageManipulator.manipulateAsync(
//           imageUri,
//           actions,
//           saveOptions
//         );
//         console.log(`Image ${index + 1} processed successfully`);
//       } catch (processError) {
//         throw new Error(`Image processing failed: ${processError.message}`);
//       }

//       // 3. Perform OCR using ML Kit
//       let ocrResult;
//       try {
//         console.log(`Performing OCR on image ${index + 1}...`);
//         const startTime = Date.now();

//         // Use detectFromUri for the processed image
//         ocrResult = await MlkitOcr.detectFromUri(processedImage.uri);

//         console.log(`OCR completed in ${Date.now() - startTime}ms`);
//       } catch (ocrError) {
//         throw new Error(`OCR processing failed: ${ocrError.message}`);
//       }

//       // 4. Process extracted text (combine all text blocks)
//       const extractedText = ocrResult
//         .map(block => block.text)
//         .join("\n")
//         .trim();

//       const cleanText = extractedText
//         .replace(/[^\w\s.,!?\-@#$%^&*()]/g, "")
//         .replace(/\s+/g, ' ')
//         .replace(/\n{3,}/g, "\n\n")
//         .trim();

//       if (!cleanText || cleanText.length < 2) {
//         throw new Error("Extracted text appears invalid");
//       }

//       extractedTexts.push(cleanText);
//       console.log(`Image ${index + 1} text extraction successful`);

//       // 5. Upload to storage (preserve original format)
//       let previewUrl = '';
//       try {
//         // Use original image for storage if it exists
//         const uploadUri = fileInfo.uri;
//         const fileBlob = await (await fetch(uploadUri)).blob();

//         const uploadRes = await storage.createFile(
//           config.bucketId,
//           ID.unique(),
//           fileBlob,
//           {
//             mimeType: `image/${SUPPORTED_FORMATS[originalExtension] || 'jpeg'}`,
//             originalName: `scan_${index}.${originalExtension}`
//           }
//         );

//         previewUrl = storage.getFilePreview(config.storageId, uploadRes.$id);
//         uploadedImageUrls.push(previewUrl);
//         console.log(`Image ${index + 1} uploaded to storage as ${originalExtension}`);
//       } catch (storageError) {
//         console.error(`Storage upload failed for image ${index + 1}:`, storageError);
//         // Continue even if storage fails since we have the text
//       }

//       scanResults.push({
//         success: true,
//         text: cleanText,
//         imageUrl: previewUrl,
//         imageIndex: index,
//         originalFormat: originalExtension
//       });

//     } catch (error) {
//       console.error(`Processing failed for image ${index + 1}:`, {
//         error: error.message,
//         uri: imageUri,
//         format: originalExtension,
//         stack: error.stack
//       });

//       scanResults.push({
//         success: false,
//         error: error.message,
//         imageUri,
//         imageIndex: index,
//         originalFormat: originalExtension
//       });

//       extractedTexts.push("");

//       // Clean up processed image file if it exists
//       if (processedImage?.uri) {
//         try {
//           await FileSystem.deleteAsync(processedImage.uri);
//         } catch (cleanupError) {
//           console.error('Failed to clean up temp file:', cleanupError);
//         }
//       }
//     }
//   }

//   // Combine all extracted texts
//   const finalText = extractedTexts
//     .filter(text => text && text.length > 0)
//     .join("\n\n")
//     .trim();

//   // Only save document if we have valid text or images
//   let savedDoc = null;
//   if (finalText.length > 0 || uploadedImageUrls.length > 0) {
//     try {
//       savedDoc = await databases.createDocument(
//         config.databaseId,
//         config.scanCollectionId,
//         ID.unique(),
//         {
//           userId,
//           extractedText: finalText,
//           createdAt: new Date().toISOString(),
//           imgUrl: uploadedImageUrls,
//           scanStatus: scanResults.map(r => ({
//             status: r.success ? 'success' : 'failed',
//             format: r.originalFormat
//           }))
//         }
//       );
//       console.log('Document saved successfully');
//     } catch (dbError) {
//       console.error('Failed to save document:', dbError);
//       throw new Error("Failed to save results to database");
//     }
//   }

//   return {
//     success: scanResults.some(r => r.success),
//     data: savedDoc,
//     individualResults: scanResults,
//     stats: {
//       total: imageUris.length,
//       succeeded: scanResults.filter(r => r.success).length,
//       failed: scanResults.filter(r => !r.success).length,
//       formatsProcessed: [...new Set(scanResults.map(r => r.originalFormat))]
//     }
//   };
// };

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
export async function getScanById(urlId) {
  try {
    const document = await databases.getDocument(
      config.databaseId,
      config.scanCollectionId,
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
    const [documents, texts, webs, scans] = await Promise.all([
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
      databases.listDocuments(config.databaseId, config.scanCollectionId, [
        Query.equal("userId", userId),
        Query.orderDesc("createdAt"),
      ]),
    ]);

    // Combine and add docType to each item
    return [
      ...documents.documents.map((doc) => ({ ...doc, docType: "Document" })),
      ...texts.documents.map((text) => ({ ...text, docType: "Text" })),
      ...webs.documents.map((web) => ({ ...web, docType: "Web" })),
      ...scans.documents.map((scan) => ({ ...scan, docType: "Scan" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching content:", error);
    throw new Error(error);
  }
}






