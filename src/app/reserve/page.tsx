"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Inventory {
  warehouseId: string;
  warehouseName: string;
}

interface Product {
  id: string;
  name: string;
  inventories: Inventory[];
}

export default function ReservePage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [productId, setProductId] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {

    const response =
      await fetch("/api/products");

    const data =
      await response.json();

    setProducts(data);
  }

  function handleProductSelect(id: string) {

    setProductId(id);

    const product =
      products.find(
        (p) => p.id === id
      );

    setSelectedProduct(product || null);

    setWarehouseId("");
  }

  async function createReservation() {

    try {

      const response =
        await fetch("/api/reservations", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            productId,
            warehouseId,
            quantity
          })
        });

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      toast.success(
        "Reservation created"
      );

      setProductId("");
        setSelectedProduct(null);
        setWarehouseId("");
        setQuantity(1);

    } catch {

      toast.error(
        "Something went wrong"
      );
    }
  }

  return (

    <main className="min-h-screen bg-gray-950 p-10">

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Reserve Product
        </h1>

        <div className="space-y-5">

          <select
            value={productId}
            onChange={(e)=>
              handleProductSelect(
                e.target.value
              )
            }
            className="w-full border p-3 rounded text-black"
          >

            <option value="">
              Select Product
            </option>

            {products.map((product)=>(

              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>

            ))}

          </select>


          <select
            value={warehouseId}
            onChange={(e)=>
              setWarehouseId(
                e.target.value
              )
            }
            className="w-full border p-3 rounded text-black"
          >

            <option value="">
              Select Warehouse
            </option>

            {selectedProduct?.inventories.map(
              (inventory)=>(

                <option
                  key={inventory.warehouseId}
                  value={inventory.warehouseId}
                >
                  {inventory.warehouseName}
                </option>

              )
            )}

          </select>


          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e)=>
              setQuantity(
                Number(e.target.value)
              )
            }
            className="w-full border p-3 rounded text-black"
          />

          <button
            onClick={createReservation}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Reserve
          </button>

        </div>

      </div>

    </main>
  );
}