"use client";

import { useEffect, useState } from "react";

interface Inventory {
  warehouseId: string;
  warehouseName: string;
  totalUnits: number;
  reservedUnits: number;
  availableUnits: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  inventories: Inventory[];
}

export default function Dashboard() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);


  async function fetchProducts() {

    try {

      const response =
        await fetch(
          "/api/products",
          {
            cache: "no-store"
          }
        );

      const data =
        await response.json();

      setProducts(data);

    } catch(error){

      console.log(error);

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    fetchProducts();

    // Faster refresh

    const interval =
    setInterval(() => {

      fetchProducts();

    },1000);

    return ()=>clearInterval(
      interval
    );

  },[]);


  if(loading){

    return(

      <div className="p-10 text-white text-xl">

        Loading Products...

      </div>

    );

  }


  const totalProducts =
  products.length;


  const totalInventory =
  products.reduce(

    (sum,product)=>

      sum +

      product.inventories.reduce(

        (invSum,inventory)=>

        invSum +
        inventory.totalUnits,

        0

      ),

    0

  );


  const totalReserved =
  products.reduce(

    (sum,product)=>

      sum +

      product.inventories.reduce(

        (invSum,inventory)=>

        invSum +
        inventory.reservedUnits,

        0

      ),

    0

  );


  const totalAvailable =
  products.reduce(

    (sum,product)=>

      sum +

      product.inventories.reduce(

        (invSum,inventory)=>

        invSum +
        inventory.availableUnits,

        0

      ),

    0

  );


  return (

    <main className="min-h-screen bg-gray-950 p-10">

      <h1 className="text-5xl font-bold text-white mb-10">

        Dashboard

      </h1>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-blue-600 rounded-xl p-6 shadow-lg">

          <h2 className="text-white text-lg">

            Products

          </h2>

          <p className="text-white text-4xl font-bold">

            {totalProducts}

          </p>

        </div>


        <div className="bg-purple-600 rounded-xl p-6 shadow-lg">

          <h2 className="text-white text-lg">

            Inventory

          </h2>

          <p className="text-white text-4xl font-bold">

            {totalInventory}

          </p>

        </div>


        <div className="bg-orange-600 rounded-xl p-6 shadow-lg">

          <h2 className="text-white text-lg">

            Reserved

          </h2>

          <p className="text-white text-4xl font-bold">

            {totalReserved}

          </p>

        </div>


        <div className="bg-green-600 rounded-xl p-6 shadow-lg">

          <h2 className="text-white text-lg">

            Available

          </h2>

          <p className="text-white text-4xl font-bold">

            {totalAvailable}

          </p>

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {

          products.map((product)=>(

            <div

              key={product.id}

              className="
              bg-white
              rounded-2xl
              shadow-xl
              p-6
              hover:scale-105
              transition
              "

            >

              <h2 className="text-3xl font-bold text-blue-600">

                {product.name}

              </h2>


              <p className="text-gray-700 mt-3 mb-5">

                {product.description}

              </p>


              {

                product.inventories.map(

                  (inventory)=>(

                  <div

                    key={inventory.warehouseId}

                    className="
                    border-t
                    border-gray-300
                    pt-4
                    mt-4
                    "

                  >

                    <p className="text-gray-900">

                      <span className="font-bold">

                        Warehouse:

                      </span>{" "}

                      {inventory.warehouseName}

                    </p>


                    <p className="text-gray-700">

                      <span className="font-bold">

                        Total:

                      </span>{" "}

                      {inventory.totalUnits}

                    </p>


                    <p className="text-orange-600 font-semibold">

                      Reserved:{" "}

                      {inventory.reservedUnits}

                    </p>


                    <p className="text-green-600 font-bold text-lg">

                      Available:{" "}

                      {inventory.availableUnits}

                    </p>

                  </div>

                ))

              }

            </div>

          ))

        }

      </div>

    </main>

  );

}