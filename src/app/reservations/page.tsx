"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  quantity: number;
  status: string;

  product: {
    name: string;
  };

  warehouse: {
    name: string;
  };
}

export default function ReservationsPage() {

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {

    try {

      const response =
        await fetch("/api/reservations");

      const data =
        await response.json();

      setReservations(data);

    } catch (error) {

      console.log(error);

    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading reservations...
      </div>
    );
  }

  return (

    <main className="min-h-screen bg-gray-950 p-10">

      <h1 className="text-5xl text-white font-bold mb-8">
        Reservations
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Warehouse
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody className="text-gray-800">

            {reservations.map((reservation) => (

              <tr
                key={reservation.id}
                className="border-b hover:bg-gray-100 transition"
              >

                <td className="p-4 font-semibold">
                  {reservation.product.name}
                </td>

                <td className="p-4 text-gray-700">
                  {reservation.warehouse.name}
                </td>

                <td className="p-4 text-gray-700">
                  {reservation.quantity}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white font-medium
                    ${
                      reservation.status === "PENDING"
                        ? "bg-yellow-500"
                        : reservation.status === "CONFIRMED"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >

                    {reservation.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}