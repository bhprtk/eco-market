import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="min-h-screen bg-green-100 text-center">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Shop Sustainably, Connect Directly 🌱
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Discover certified eco-products and chat with ethical sellers.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/products"
                className="bg-green-800 text-white px-6 py-3 rounded text-lg hover:bg-green-700 transition"
              >
                Browse Products
              </Link>
              <Link
                href="/products/new"
                className="border border-green-800 text-green-700 px-6 py-3 rounded text-lg hover:bg-green-800 hover:text-white transition"
              >
                Sell a Product
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* How It Works */}
      <section className="py-30 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Add Certified Products",
                desc: "Sellers list eco-friendly items with verified sustainability certificates.",
              },
              {
                title: "2. Connect via Chat",
                desc: "Buyers ask questions and get details directly from the seller.",
              },
              {
                title: "3. Buy Consciously",
                desc: "Support sustainable practices and reduce your environmental impact.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for Featured Products */}
      {/* <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">Featured Products</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="text-center py-6">
        <p>&copy; {new Date().getFullYear()} Eco Marketplace · Built with ❤️</p>
      </footer>
    </main>
  );
}
