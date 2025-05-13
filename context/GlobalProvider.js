// import React, { createContext, useContext, useEffect, useState } from "react";

// import { getCurrentUser } from "../lib/appwrite";

// const GlobalContext = createContext();
// export const useGlobalContext = () => useContext(GlobalContext);

// const GlobalProvider = ({ children }) => {
//   const [isLogged, setIsLogged] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getCurrentUser()
//       .then((res) => {
//         if (res) {
//           setIsLogged(true);
//           setUser(res);
//         } else {
//           setIsLogged(false);
//           setUser(null);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <GlobalContext.Provider
//       value={{
//         isLogged,
//         setIsLogged,
//         user,
//         setUser,
//         loading,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export default GlobalProvider;

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadUserAndImages = async () => {
      try {
        const [userData, cachedImages] = await Promise.all([
          getCurrentUser(),
          AsyncStorage.getItem("cachedImages"),
        ]);

        if (userData) {
          setIsLogged(true);
          setUser(userData);
        }

        if (cachedImages) {
          setImages(JSON.parse(cachedImages));
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndImages();
  }, []);

  useEffect(() => {
    const saveImages = async () => {
      try {
        if (images.length > 0) {
          await AsyncStorage.setItem("cachedImages", JSON.stringify(images));
        } else {
          await AsyncStorage.removeItem("cachedImages");
        }
      } catch (error) {
        console.error("Failed to save images:", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      saveImages();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [images]);

  const addImage = (uri) => {
    setImages((prev) => {
      // Avoid duplicates
      if (!prev.includes(uri)) {
        return [...prev, uri];
      }
      return prev;
    });
  };

  const clearImages = () => {
    setImages([]);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        images,
        addImage,
        clearImages,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;