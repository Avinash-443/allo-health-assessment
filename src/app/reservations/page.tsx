"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  quantity: number;
  status: string;
  expiresAt: string;

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

  const [currentTime, setCurrentTime] =
    useState(Date.now());

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  useEffect(() => {

    loadReservations();

    // Auto cleanup + refresh
    const refreshInterval =
      setInterval(async () => {

        try {

          await fetch(
            "/api/cleanup",
            {
              method: "POST"
            }
          );

          await loadReservations();

        } catch(error){

          console.log(error);

        }

      },5000);

    // Timer update every second
    const timerInterval =
      setInterval(() => {

        setCurrentTime(
          Date.now()
        );

      },1000);

    return () => {

      clearInterval(
        refreshInterval
      );

      clearInterval(
        timerInterval
      );

    };

  },[]);

  async function loadReservations(){

    try{

      const response =
        await fetch(
          "/api/reservations"
        );

      const data =
        await response.json();

      setReservations(data);

    }
    catch(error){

      console.log(error);

    }

    setLoading(false);

  }

  async function confirmReservation(
    reservationId:string
  ){

    setProcessingId(
      reservationId
    );

    try{

      await fetch(
        "/api/reservations/confirm",
        {
          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({
            reservationId
          })
        }
      );

      await loadReservations();

    }
    catch(error){

      console.log(error);

    }

    setProcessingId(
      null
    );

  }

  async function cancelReservation(
    reservationId:string
  ){

    setProcessingId(
      reservationId
    );

    try{

      await fetch(
        "/api/reservations/cancel",
        {
          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({
            reservationId
          })
        }
      );

      await loadReservations();

    }
    catch(error){

      console.log(error);

    }

    setProcessingId(
      null
    );

  }

  function getRemainingTime(
    expiresAt:string
  ){

    const remaining =
      new Date(
        expiresAt
      ).getTime()
      -
      currentTime;

    if(
      remaining <=0
    ){

      return "Expired";

    }

    const minutes =
      Math.floor(
        remaining/60000
      );

    const seconds =
      Math.floor(
        (
          remaining%
          60000
        )/1000
      );

    return `${minutes}m ${seconds}s`;

  }

  if(
    loading
  ){

    return(

      <div className=
      "p-10 text-white">

        Loading...

      </div>

    );

  }

  return(

    <main className=
    "min-h-screen bg-gray-950 p-10">

      <h1 className=
      "text-5xl text-white font-bold mb-8">

        Reservations

      </h1>

      <div className=
      "bg-white rounded-xl overflow-hidden">

        <table className=
        "w-full">

          <thead className=
          "bg-blue-600 text-white">

            <tr>

              <th className="p-4">
                Product
              </th>

              <th className="p-4">
                Warehouse
              </th>

              <th className="p-4">
                Quantity
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Expires In
              </th>

              <th className="p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className=
          "text-gray-800">

            {reservations.map(
            (reservation)=>(

            <tr
            key={
            reservation.id
            }

            className=
            "border-b hover:bg-gray-100"
            >

              <td className="p-4">
                {reservation.product.name}
              </td>

              <td className="p-4">
                {reservation.warehouse.name}
              </td>

              <td className="p-4">
                {reservation.quantity}
              </td>

              <td className="p-4">

                <span
                className={`px-3 py-1 rounded text-white

                ${
                  reservation.status==="PENDING"
                  ? "bg-yellow-500"
                  : reservation.status==="CONFIRMED"
                  ? "bg-green-600"
                  : "bg-red-600"
                }`}
                >

                  {reservation.status}

                </span>

              </td>

              <td className=
              "p-4 font-semibold text-red-600">

              {
              reservation.status==="PENDING"

              ?

              getRemainingTime(
                reservation.expiresAt
              )

              :

              "-"
              }

              </td>

              <td className="p-4">

              {

              reservation.status==="PENDING"

              &&

              getRemainingTime(
                reservation.expiresAt
              )!=="Expired"

              &&

              <div className=
              "flex gap-2">

                <button
                disabled={
                  processingId===
                  reservation.id
                }

                onClick={()=>confirmReservation(
                  reservation.id
                )}

                className=
                "bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                >

                  Confirm

                </button>

                <button

                disabled={
                  processingId===
                  reservation.id
                }

                onClick={()=>cancelReservation(
                  reservation.id
                )}

                className=
                "bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >

                  Cancel

                </button>

              </div>

              }

              </td>

            </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>

  );

}