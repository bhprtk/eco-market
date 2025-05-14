"use client";
import Link from "next/link";
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
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 cursor-pointer">
            <h1 className="text-xl mb-6">
                {products.length} Product{products.length !== 1 && "s"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                        <div className="hover:shadow-md transition p-4 bg-white rounded-md">
                            <div className="flex justify-center">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="w-full h-64 object-contain rounded-md bg-white"
                                />
                            </div>

                            <h2 className="text-2xl font-semibold mt-4">{product.title}</h2>
                            <p className="text-2xl mt-2">${product.price.toFixed(2)}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.cert.map((label, index) => (
                                    <span
                                        key={index}
                                        className="inline-block text-sm bg-green-100 text-green-800 px-2 py-1 rounded"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>

                ))}
            </div>
        </main>
    );
}
