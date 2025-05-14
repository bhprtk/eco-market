"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

export default function NewProductPage() {
  const { user, authReady } = useAuth();
  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    materials: "",
    packaging: [],
    cert: [],
    origin: "",
    earthFriendly: [],
    madeWithout: [],
    socialOptions: [],
    careInstructions: "",
    endOfLife: "",
  });

  // 🔐 Redirect unauthenticated users to login
  // useEffect(() => {

    // if (user === null) return; // still loading
    //   if (!user) {
    //     router.push("/login");
    //   } else {
    //     setLoading(false);
    //   }
    // }, [user, router]);
    useEffect(() => {
      if (!authReady) return; // wait until Firebase auth is ready
      if (!user) router.push("/login");
    }, [authReady, user]);


    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;

      if (type === "checkbox") {
        setForm((prev) => ({
          ...prev,
          [name]: prev[name].includes(value)
            ? prev[name].filter((item) => item !== value)
            : [...prev[name], value],
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user) return alert("Login required");

      if (!imageFile) {
        setImageError("Please upload a product image.");
        return;
      }
      setImageError("");

      const requiredGroups = ["cert", "packaging", "earthFriendly", "madeWithout", "socialOptions"];
      const errors = {};
      requiredGroups.forEach((group) => {
        if (!form[group] || form[group].length === 0) {
          errors[group] = `Please select at least one ${group}`;
        }
      });
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;

      try {
        let imageUrl = form.imageUrl;

        if (imageFile) {
          setUploading(true);
          const imageRef = ref(storage, `product-images/${user.uid}-${Date.now()}`);
          await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(imageRef);
          setUploading(false);
        }

        await addDoc(collection(db, "products"), {
          ...form,
          imageUrl,
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
      "FSC Certified", "USDA Organic", "GOTS Certified", "Fair Trade Certified", "Energy Star",
      "BPA-Free", "Recycled Material Certified", "Biodegradable", "Vegan Certified",
      "Organic Content Standard", "Safe & Fair Labor"
    ];

    const packagingOptions = ["Plastic-Free", "Compostable", "Recyclable", "Minimal Packaging", "Zero Waste"];
    const earthFriendlyOptions = [
      "Reusable", "Biodegradable", "Refillable", "Durable", "Vegan", "Cruelty-Free",
      "Water Saving", "Energy Efficient", "Carbon Neutral Shipping", "Wool",
      "Natural Fibers", "Recycled Materials"
    ];
    const madeWithoutOptions = ["Plastics", "Harsh Chemicals", "Animal Testing", "Palm Oil", "Synthetic Fragrances"];
    const socialOptions = ["Women Owned", "Minority Owned", "Small Business", "Ethical Labor", "Local Artisan"];

    // if (!loading) {


      return (
        <main className="max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image upload */}
            <div>
              <label className="block font-medium mb-1">Product Image</label>
              {previewUrl && (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-xs rounded-md object-cover border mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl("");
                      setImageFile(null);
                    }}
                    className="text-sm border border-red-500 text-red-500 px-4 py-1 rounded-md hover:bg-red-500 hover:text-white transition cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <label className="cursor-pointer inline-block px-4 py-2 border border-green-800 text-green-800 rounded-md hover:bg-green-800 hover:text-white transition">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
              {imageError && <p className="text-red-600 text-sm mt-2">{imageError}</p>}
            </div>

            {[{ label: "Title", name: "title" }, { label: "Price ($)", name: "price", type: "number" },
            { label: "Description", name: "description" }, { label: "Materials Used", name: "materials" },
            { label: "Origin / Made In", name: "origin" }, { label: "Care Instructions", name: "careInstructions" },
            { label: "End of Life Instructions", name: "endOfLife" }].map((input) => (
              <div key={input.name}>
                <label className="block font-medium">{input.label}</label>
                {input.name === "description" ? (
                  <textarea
                    name={input.name}
                    value={form[input.name]}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                ) : (
                  <input
                    type={input.type || "text"}
                    name={input.name}
                    value={form[input.name]}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded-md"
                  />
                )}
              </div>
            ))}

            {[{ title: "Certifications", name: "cert", options: certOptions },
            { title: "Packaging", name: "packaging", options: packagingOptions },
            { title: "Earth-Friendly Features", name: "earthFriendly", options: earthFriendlyOptions },
            { title: "Made Without", name: "madeWithout", options: madeWithoutOptions },
            { title: "Social/Ethical Tags", name: "socialOptions", options: socialOptions }].map((section) => (
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
                {formErrors[section.name] && (
                  <p className="text-red-600 text-sm mt-2">{formErrors[section.name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="border border-green-800 text-green-800 px-6 py-2 rounded-md hover:bg-green-800 hover:text-white transition cursor-pointer"
            >
              Submit Product
            </button>
          </form>
        </main>
      );
    } 
    // else {
    //   return (
    //     <div>Loading...</div>
    //   )
    // }
  // }
