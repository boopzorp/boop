
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

// Function to convert a data URI to a Blob
function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}


export const uploadImageFromString = async (dataUrl: string, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    
    // Firebase's `uploadString` can handle the data URL format directly
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
    console.log('Uploaded a data_url string!', snapshot);

    // Get the permanent download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  }
};
