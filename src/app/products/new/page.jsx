"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

export default function NewProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    materials: "",
    ingredients: "",
    packaging: [],
    cert: [],
    origin: "",
    ethicallySourced: false,
    earthFriendly: [],
    madeWithout: [],
    socialOptions: [],
    careInstructions: "",
    sellerMessage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name !== "ethicallySourced") {
      setForm((prev) => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter((item) => item !== value)
          : [...prev[name], value],
      }));
    } else if (type === "checkbox" && name === "ethicallySourced") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: parseFloat(form.price),
        sellerId: user.uid,
        createdAt: serverTimestamp(),
      });
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to upload product");
    }
  };

  const certOptions = [
    "FSC Certified",
    "USDA Organic",
    "GOTS Certified",
    "Fair Trade Certified",
    "Energy Star",
    "BPA-Free",
    "Recycled Material Certified",
    "Biodegradable",
    "Vegan Certified",
    "Organic Content Standard",
    "Safe & Fair Labor"
  ];

  const packagingOptions = [
    "Plastic-Free",
    "Compostable",
    "Recyclable",
    "Minimal Packaging",
    "Zero Waste",
  ];

  const earthFriendlyOptions = [
    "Reusable",
    "Biodegradable",
    "Refillable",
    "Durable",
    "Vegan",
    "Cruelty-Free",
    "Water Saving",
    "Energy Efficient",
    "Carbon Neutral Shipping",
    "Wool",
    "Natural Fibers",
    "Recycled Materials",
  ];

  const madeWithoutOptions = [
    "Plastics",
    "Harsh Chemicals",
    "Animal Testing",
    "Palm Oil",
    "Synthetic Fragrances",
  ];

  const socialOptions = [
    "Women Owned",
    "Minority Owned",
    "Small Business",
    "Ethical Labor",
    "Local Artisan",
  ]

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {[
          { label: "Title", name: "title" },
          { label: "Price ($)", name: "price", type: "number" },
          { label: "Image URL", name: "imageUrl" },
          { label: "Description", name: "description" },
          { label: "Materials Used", name: "materials" },
          { label: "Ingredients", name: "ingredients" },
          { label: "Origin / Made In", name: "origin" },
          { label: "Care Instructions", name: "careInstructions" },
          { label: "Seller Message / Story", name: "sellerMessage" },
        ].map((input) => (
          <div key={input.name}>
            <label className="block font-medium">{input.label}</label>
            <input
              type={input.type || "text"}
              name={input.name}
              value={form[input.name]}
              onChange={handleChange}
              required={input.name === "title" || input.name === "price" || input.name === "imageUrl"}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
        ))}

        {/* Ethically Sourced */}
        <div>
          <label className="block font-medium">Ethically Sourced?</label>
          <input
            type="checkbox"
            name="ethicallySourced"
            checked={form.ethicallySourced}
            onChange={handleChange}
          /> Yes
        </div>

        {/* Multi-select sections */}
        {[
          { title: "Certifications", name: "cert", options: certOptions },
          { title: "Packaging", name: "packaging", options: packagingOptions },
          { title: "Earth-Friendly Features", name: "earthFriendly", options: earthFriendlyOptions },
          { title: "Made Without", name: "madeWithout", options: madeWithoutOptions },
          { title: "Social/Ethical Tags", name: "socialOptions", options: socialOptions }
        ].map((section) => (
          <div key={section.name}>
            <p className="font-medium mb-2">{section.title}:</p>
            <div className="grid grid-cols-2 gap-3">
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-2 border border-gray-300 rounded-md hover:border-green-500 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    name={section.name}
                    value={option}
                    checked={form[section.name].includes(option)}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-800 accent-green-800 rounded focus:ring-green-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

        ))}

        <button
          type="submit"
          className="bg-green-800 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Submit Product
        </button>
      </form>
    </main>
  );
}
