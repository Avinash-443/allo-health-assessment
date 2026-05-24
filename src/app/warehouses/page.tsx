"use client";

import { useEffect, useState } from "react";

interface Warehouse {
    id:string;
    name:string;
    location:string;
}

export default function WarehousePage(){

    const [
        warehouses,
        setWarehouses
    ] = useState<Warehouse[]>([]);

    const [
        name,
        setName
    ] = useState("");

    const [
        location,
        setLocation
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        toast,
        setToast
    ] = useState("");

    useEffect(()=>{

        loadWarehouses();

    },[]);

    async function loadWarehouses(){

        try{

            const response =
                await fetch(
                    "/api/warehouses"
                );

            const data =
                await response.json();

            setWarehouses(
                data
            );

        }
        catch(error){

            console.log(
                error
            );

        }

    }

    async function addWarehouse(){

        if(
            !name ||
            !location
        ){
            return;
        }

        setLoading(
            true
        );

        try{

            const response =
                await fetch(
                    "/api/warehouses/manage",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:
                        JSON.stringify({

                            name,
                            location

                        })
                    }
                );

            if(
                response.ok
            ){

                setToast(
                    "Warehouse added successfully"
                );

                setName("");
                setLocation("");

                loadWarehouses();

                setTimeout(()=>{

                    setToast("");

                },3000);

            }

        }
        catch(error){

            console.log(
                error
            );

        }

        setLoading(
            false
        );

    }

    return(

        <main
        className="
        min-h-screen
        bg-gray-950
        p-10">

            <h1
            className="
            text-5xl
            font-bold
            text-white
            mb-10">

                Warehouses

            </h1>

            {

            toast &&

            <div
            className="
            bg-green-600
            text-white
            px-4
            py-3
            rounded-lg
            mb-5
            max-w-xl">

                {toast}

            </div>

            }

            <div
            className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10">

                <div
                className="
                bg-white
                rounded-xl
                p-8">

                    <h2
                    className="
                    text-2xl
                    font-bold
                    mb-6
                    text-black">

                        Add Warehouse

                    </h2>

                    <input
                    value={name}

                    onChange={(e)=>
                    setName(
                        e.target.value
                    )}

                    placeholder=
                    "Warehouse Name"

                    className="
                    w-full
                    border
                    p-3
                    rounded
                    mb-4
                    text-black"
                    />

                    <input
                    value={location}

                    onChange={(e)=>
                    setLocation(
                        e.target.value
                    )}

                    placeholder=
                    "Location"

                    className="
                    w-full
                    border
                    p-3
                    rounded
                    mb-6
                    text-black"
                    />

                    <button

                    onClick={
                        addWarehouse
                    }

                    disabled={
                        loading
                    }

                    className="
                    bg-blue-600
                    text-white
                    px-6
                    py-3
                    rounded">

                        {
                            loading
                            ?
                            "Adding..."
                            :
                            "Add Warehouse"
                        }

                    </button>

                </div>

                <div
                className="
                bg-white
                rounded-xl
                p-8">

                    <h2
                    className="
                    text-2xl
                    font-bold
                    mb-6
                    text-black">

                        Warehouse List

                    </h2>

                    {

                    warehouses.map(
                    (warehouse)=>(

                    <div

                    key={
                    warehouse.id
                    }

                    className="
                    border-b
                    py-4">

                        <p
                        className="
                        font-bold
                        text-black">

                            {
                            warehouse.name
                            }

                        </p>

                        <p
                        className="
                        text-gray-600">

                            {
                            warehouse.location
                            }

                        </p>

                    </div>

                    ))

                    }

                </div>

            </div>

        </main>

    );

}