export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Inventory Reservation System
        </h1>

        <p className="text-lg text-gray-700 mb-10">
          Manage products, inventory and reservations efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">
              Products
            </h2>

            <p className="text-gray-600">
              View all available products and inventory.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              Reservations
            </h2>

            <p className="text-gray-600">
              Track active and expired reservations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">
              Warehouses
            </h2>

            <p className="text-gray-600">
              Monitor stock across warehouses.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}