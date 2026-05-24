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

        }
        catch(error){

          console.log(error);

        }

      },5000);


    const timerInterval =
      setInterval(()=>{

        setCurrentTime(
          Date.now()
        );

      },1000);

    return ()=>{

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

      setReservations(
        data
      );

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
      remaining<=0
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
        remaining%60000
      )/1000
    );

    return `${minutes}m ${seconds}s`;

  }


  if(loading){

    return(

      <div className=
      "p-10 text-white text-xl">

        Loading...

      </div>

    );

  }


  return(

    <main className=
    "min-h-screen bg-gray-950 p-10">

      <h1 className=
      "text-5xl font-bold text-white mb-10">

        Reservations

      </h1>

      <div className=
      "bg-white rounded-2xl shadow-xl overflow-hidden">

        <table className=
        "w-full">

          <thead className=
          "bg-blue-600 text-white">

            <tr className="text-center">

              <th className="p-5">
                Product
              </th>

              <th className="p-5">
                Warehouse
              </th>

              <th className="p-5">
                Quantity
              </th>

              <th className="p-5">
                Status
              </th>

              <th className="p-5">
                Expires In
              </th>

              <th className="p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className=
          "text-gray-800">

            {

            reservations.map(
            (reservation)=>(

            <tr

            key={
            reservation.id
            }

            className=
            "border-b text-center hover:bg-gray-100 h-20 transition"

            >

              <td className=
              "font-semibold">

                {reservation.product.name}

              </td>

              <td>

                {reservation.warehouse.name}

              </td>

              <td>

                {reservation.quantity}

              </td>

              <td>

                <span

                className=
                {`inline-block w-32 py-2 rounded-lg text-white font-semibold

                ${
                  reservation.status==="PENDING"
                  ? "bg-yellow-500"

                  : reservation.status==="CONFIRMED"
                  ? "bg-green-600"

                  : "bg-red-600"
                }
                `}
                >

                  {reservation.status}

                </span>

              </td>

              <td
              className=
              "font-semibold text-red-600"
              >

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

              <td>

              {

              reservation.status==="PENDING"

              &&

              getRemainingTime(
              reservation.expiresAt
              )!=="Expired"

              ?

              <div className=
              "flex justify-center gap-3">

                <button

                disabled={
                  processingId===
                  reservation.id
                }

                onClick={()=>confirmReservation(
                  reservation.id
                )}

                className=
                "bg-green-600 text-white px-4 py-2 rounded-lg w-24 hover:bg-green-700"

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
                "bg-red-600 text-white px-4 py-2 rounded-lg w-24 hover:bg-red-700"

                >

                  Cancel

                </button>

              </div>

              :

              "-"

              }

              </td>

            </tr>

            ))

            }

          </tbody>

        </table>

      </div>

    </main>

  );

}