// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { getWebById } from "../../lib/appwrite";
// import { WebView } from "react-native-webview";
// import TTSFuction from "../../components/Tts";
// const { height } = Dimensions.get("window");

// const FileView = () => {
//   const { urlId } = useLocalSearchParams();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [webViewError, setWebViewError] = useState(false);

//   useEffect(() => {
//     fetchDocument();
//   }, [urlId]);

//   const fetchDocument = async () => {
//     try {
//       const doc = await getWebById(urlId);
//       setDocument(doc);
//     } catch (error) {
//       console.error("Error loading document:", error);
//       Alert.alert("Error", "Failed to load URL");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3273F6" />
//       </View>
//     );
//   }

//   if (!document) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>No URL found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.safe}>
//       {webViewError ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>
//             Failed to load the webpage. Please check the URL.
//           </Text>
//         </View>
//       ) : (
//         <WebView
//           source={{ uri: document.link }}
//           style={styles.webview}
//           onError={() => setWebViewError(true)}
//           startInLoadingState={true}
//           renderLoading={() => (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#3273F6" />
//             </View>
//           )}
//         />
//       )}
//       <TTSFuction />
//     </View>
//   );
// };

// export default FileView;

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   webview: {
//     flex: 1,
//     height: height - 100, // Adjust based on your header height
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//     textAlign: "center",
//   },
// });

// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { getWebById } from "../../lib/appwrite";
// import { WebView } from "react-native-webview";
// import TTSFuction from "../../components/Tts";
// import HtmlParser from "react-native-html-parser";

// const { height } = Dimensions.get("window");

// const FileView = () => {
//   const { urlId } = useLocalSearchParams();
//   const [document, setDocument] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [extractedText, setExtractedText] = useState("");

//   useEffect(() => {
//     fetchDocument();
//   }, [urlId]);

//   const cleanHTML = (html) => {
//     return html.replace(/defer\s*=\s*(['"]?)[^'"\s>]*\1/gi, ""); // Remove defer attributes
//   };

//   const fetchDocument = async () => {
//     try {
//       const doc = await getWebById(urlId);
//       if (!doc?.link) throw new Error("Invalid URL");

//      const response = await fetch(doc.link);
// let html = await response.text();
// html = cleanHTML(html);  // Sanitize the HTML before parsing

//       // Parse HTML with react-native-html-parser
      
//       const parser = new HtmlParser.DOMParser();
//       const docHtml = parser.parseFromString(html, "text/html");
//       const paragraphs = docHtml.getElementsByTagName("p");
//       const textContent = Array.from(paragraphs).map((p) => p.textContent).join(" ");

//       setDocument(doc);
//       setExtractedText(textContent);
//     } catch (error) {
//       console.error("Error loading document:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3273F6" />
//       </View>
//     );
//   }

//   if (!document) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>No URL found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.safe}>
//       <WebView source={{ uri: document.link }} style={styles.webview} />
//       <TTSFuction text={extractedText} />
//     </View>
//   );
// };

// export default FileView;
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getWebById } from "../../lib/appwrite";
import { WebView } from "react-native-webview";
import TTSFuction from "../../components/Tts";

const { height } = Dimensions.get("window");

const FileView = () => {
  const { urlId } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extractedText, setExtractedText] = useState("");

  // JavaScript to be injected for ad blocking
  const adBlockScript = `
    (function() {
      // Common ad selectors
      const adSelectors = [
        // Generic ad selectors
        '[class*="ad-"]',
        '[class*="ads-"]',
        '[class*="advertisement"]',
        '[id*="ad-"]',
        '[id*="ads-"]',
        // Common ad containers
        '.ad',
        '.ads',
        '.advertisement',
        '.banner-ads',
        '.dfp-ad',
        '.sponsored-content',
        '.reklama',
        '.adsbygoogle',
        // Social sharing widgets
        '.social-share',
        '.share-buttons',
        // Newsletter popups
        '.newsletter-popup',
        '.subscribe-popup',
        // Generic popups and overlays
        '[class*="popup"]',
        '[class*="overlay"]',
        // Cookie notices
        '.cookie-notice',
        '.cookie-banner',
        // Specific ad providers
        '[id^="google_ads_"]',
        '[id^="div-gpt-ad"]',
        '[class*="taboola"]',
        '[class*="outbrain"]',
        // iframes commonly used for ads
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]',
        'iframe[src*="adnxs.com"]',
      ];

      function removeAds() {
        // Remove elements matching selectors
        adSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.remove();
          });
        });

        // Remove empty ad containers
        document.querySelectorAll('div').forEach(div => {
          if (div.innerHTML.trim() === '' && 
              (div.id.toLowerCase().includes('ad') || 
               div.className.toLowerCase().includes('ad'))) {
            div.remove();
          }
        });

        // Fix layout issues after removing ads
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
      }

      // Initial removal
      removeAds();

      // Watch for dynamic ad insertions
      const observer = new MutationObserver(() => {
        removeAds();
      });

      // Start observing the document with the configured parameters
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    })();
  `;

  useEffect(() => {
    fetchDocument();
  }, [urlId]);

  const extractTextContent = (html) => {
    try {
      // Remove scripts
      let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      // Remove styles
      text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      
      // Remove all HTML tags but keep their content
      text = text.replace(/<[^>]+>/g, ' ');
      
      // Remove extra whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      // Decode HTML entities
      text = text.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/&#039;/g, "'")
                 .replace(/&#x27;/g, "'")
                 .replace(/&ldquo;/g, '"')
                 .replace(/&rdquo;/g, '"')
                 .replace(/&rsquo;/g, "'")
                 .replace(/&lsquo;/g, "'")
                 .replace(/&mdash;/g, '—')
                 .replace(/&ndash;/g, '–')
                 .replace(/&hellip;/g, '...');
      
      return text;
    } catch (error) {
      console.error('Error extracting text:', error);
      return '';
    }
  };

  const fetchDocument = async () => {
    try {
      const doc = await getWebById(urlId);
      if (!doc?.link) throw new Error("Invalid URL");

      const response = await fetch(doc.link);
      const html = await response.text();
      
      // Extract text content directly without HTML parsing
      const textContent = extractTextContent(html);

      setDocument(doc);
      setExtractedText(textContent);
    } catch (error) {
      console.error("Error loading document:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3273F6" />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No URL found</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <WebView 
        source={{ uri: document.link }} 
        style={styles.webview}
        injectedJavaScript={adBlockScript}
        injectedJavaScriptBeforeContentLoaded={adBlockScript}
        onShouldStartLoadWithRequest={(request) => {
          // Block common ad networks
          const blockedDomains = [
            'doubleclick.net',
            'googlesyndication.com',
            'adnxs.com',
            'facebook.com/plugins',
            'google-analytics.com',
            'taboola.com',
            'outbrain.com',
            'criteo.com',
            'quantserve.com',
            'advertising.com',
          ];
          
          return !blockedDomains.some(domain => request.url.includes(domain));
        }}
      />
      <TTSFuction text={extractedText} />
    </View>
  );
};

export default FileView;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    height: height - 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});