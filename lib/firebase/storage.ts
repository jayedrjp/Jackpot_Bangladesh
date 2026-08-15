import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export async function uploadImage(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
