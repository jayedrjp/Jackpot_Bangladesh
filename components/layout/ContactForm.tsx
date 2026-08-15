"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/services/contacts";
import { useToast } from "@/components/ui/Toast";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactForm({ name, email, phone, message });
      showToast("Message sent — we'll get back to you soon");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 p-6 space-y-4">
      <h2 className="font-bold text-lg text-jackpot-black">Send us a message</h2>
      <input
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
      />
      <input
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
      />
      <textarea
        required
        rows={4}
        placeholder="How can we help?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-jackpot-red"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-jackpot-red py-3 font-bold text-white hover:bg-jackpot-red-dark disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
