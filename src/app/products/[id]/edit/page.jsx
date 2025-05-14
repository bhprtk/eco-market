// app/products/[id]/edit/page.jsx

import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import EditProductClient from "./EditProductClient";

export async function generateStaticParams() {
	const snapshot = await getDocs(collection(db, "products"));
	return snapshot.docs.map((doc) => ({ id: doc.id }));
}

export default async function EditProductPage({ params }) {
	const docRef = doc(db, "products", params.id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) return <p>Product not found</p>;

	const data = docSnap.data();

	const product = {
		id: docSnap.id, // ✅ Add this line to include the Firestore document ID
		...data,
		createdAt:
			data.createdAt && typeof data.createdAt.toDate === "function"
				? data.createdAt.toDate().toISOString()
				: null,
	};



	return <EditProductClient product={product} />;
}
