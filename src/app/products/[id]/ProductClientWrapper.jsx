"use client";

import ProductTabs from "./ProductTabs";
import ClientActions from "./ClientActions";





export default function ProductClientWrapper({ product, seller }) {
 


  return (
    <div>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="flex justify-center items-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="rounded-md object-contain max-w-full h-auto"
          />
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-5xl mb-2">{product.title}</h1>

          <p className="text-5xl font-semibold my-10">
            ${parseFloat(product.price).toFixed(2)}
          </p>


          {/* <p className="mb-4 text-gray-600">{product.description}</p> */}

          {/* Certifications */}
          <div className="mb-4">
            <p className="text-xl mb-1">Certifications:</p>
            <div className="flex flex-wrap gap-2">
              {product.cert?.map((c, i) => (
                <span
                  key={i}
                  className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Packaging */}
          <div className="mb-4">
            <p className="text-xl mb-1">Ethical Credentials:</p>
            <div className="flex flex-wrap gap-2">
              {product.socialOptions?.map((p, i) => (
                <span
                  key={i}
                  className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          {seller && (
            <div className="mb-6">
              <p className="text-lg mb-2">Sold by:</p>
              <div className="flex items-center gap-3">
                <img
                  src={seller.photoURL}
                  alt={seller.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-lg font-medium text-gray-800">{seller.name}</span>
              </div>
            </div>
          )}


          <ClientActions
            sellerId={product.sellerId}
            productId={product.id}
           
          />
         

        </div>
      </main>
      <div className="w-screen bg-orange-50 ">
        <ProductTabs product={product} />
      </div>

    
    </div>
  );
}
