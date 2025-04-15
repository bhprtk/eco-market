"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(data);
        };

        loadProducts();
    }, []);

    return (
        <main className="p-8">
            <h1 className="text-xl mb-6">
                {products.length} Product{products.length !== 1 && "s"}
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
                        <img
                            src={product.imageURL}
                            alt={product.title}
                            className="w-full h-64 object-contain rounded-md mb-4 bg-white"
                        />

                        <h2 className="text-xl font-semibold">{product.title}</h2>
                        <p className="text-green-600 font-bold text-lg">${product.price}</p>
                        <span className="inline-block mt-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {product.cert}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}
