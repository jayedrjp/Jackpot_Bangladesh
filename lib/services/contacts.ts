import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

const contactsCol = collection(db, "contacts");

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    return await addDoc(contactsCol, {
      ...data,
      createdAt: Date.now(),
      resolved: false,
    });
  } catch (err) {
    console.error("[contacts] submitContactForm failed:", err);
    throw err;
  }
}
