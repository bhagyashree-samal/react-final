import CryptoJS from 'crypto-js';

const secretKey = 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=';

export const encryptData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
        return encrypted;
    } catch (e) {
        console.error("Encryption error", e);
        return null;
    }
};

export const decryptData = (encryptedData) => {
    try {
        // If it's pure text or JSON directly, parse it.
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (e) {
         console.error("Decryption error", e);
         return null;
    }
};
