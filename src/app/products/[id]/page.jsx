import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ProductClientWrapper from "./ProductClientWrapper";

// Static export requirement
export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id }));
}

export default async function ProductPage({ params }) {
  const docRef = doc(db, "products", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return <div>Product not found</div>;

  const data = docSnap.data();
  const product = {
    ...data,
    id: params.id, // ✅ make sure ID is included
    createdAt:
      data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate().toISOString()
        : null,
  };

  // 🔥 Fetch seller info from users/{uid}
  let seller = null;
  if (product.sellerId) {
    const sellerSnap = await getDoc(doc(db, "users", product.sellerId));
    if (sellerSnap.exists()) {
      const sellerData = sellerSnap.data();
      seller = {
        ...sellerData,
        createdAt:
          sellerData.createdAt && typeof sellerData.createdAt.toDate === "function"
            ? sellerData.createdAt.toDate().toISOString()
            : null,
      };
    }
  }

  return <ProductClientWrapper product={product} seller={seller} />;
}
