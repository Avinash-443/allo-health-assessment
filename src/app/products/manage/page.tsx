"use client";

import { useEffect, useState } from "react";


interface Warehouse {
    id:string;
    name:string;
}

export default function ManageProducts(){

    const [
        name,
        setName
    ] = useState("");

    const [
        description,
        setDescription
    ] = useState("");

    const [
        totalUnits,
        setTotalUnits
    ] = useState("");

    const [
        warehouseId,
        setWarehouseId
    ] = useState("");

    const [
        warehouses,
        setWarehouses
    ] = useState<Warehouse[]>([]);

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

            if(
                data.length>0
            ){

                setWarehouseId(
                    data[0].id
                );

            }

        }
        catch(error){

            console.log(
                error
            );

        }

    }

    async function addProduct(){

        setLoading(
            true
        );

        try{

            const response =
            await fetch(
                "/api/products/manage",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                    JSON.stringify({

                        name,
                        description,
                        warehouseId,
                        totalUnits

                    })
                }
            );

            if(
                response.ok
            ){

                setToast(
                    "Product added successfully"
                );

                // Reset fields

                setName("");

                setDescription("");

                setTotalUnits("");

                if(
                    warehouses.length>0
                ){

                    setWarehouseId(
                        warehouses[0].id
                    );

                }

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

        <>

        

        <main
        className=
        "min-h-screen bg-gray-950 p-10">

            <h1
            className=
            "text-5xl font-bold text-white mb-10">

                Add Product

            </h1>

            {

            toast &&

            <div
            className="
            bg-green-600
            text-white
            px-5
            py-3
            rounded-lg
            mb-6
            max-w-xl
            ">

                {toast}

            </div>

            }

            <div
            className=
            "bg-white rounded-xl p-8 max-w-xl">

                <div className=
                "mb-4">

                    <label
                    className=
                    "block font-bold text-black mb-2">

                        Product Name

                    </label>

                    <input
                    value={name}

                    onChange={(e)=>
                    setName(
                        e.target.value
                    )}

                    className=
                    "w-full border p-3 rounded text-black"
                    />

                </div>

                <div className=
                "mb-4">

                    <label
                    className=
                    "block font-bold text-black mb-2">

                        Description

                    </label>

                    <textarea

                    value={
                        description
                    }

                    onChange={(e)=>
                    setDescription(
                        e.target.value
                    )}

                    className=
                    "w-full border p-3 rounded text-black"
                    />

                </div>

                <div className=
                "mb-4">

                    <label
                    className=
                    "block font-bold text-black mb-2">

                        Warehouse

                    </label>

                    <select

                    value={
                        warehouseId
                    }

                    onChange={(e)=>
                    setWarehouseId(
                        e.target.value
                    )}

                    className=
                    "w-full border p-3 rounded text-black"
                    >

                    {
                    warehouses.map(
                    (warehouse)=>(

                    <option
                    key={
                    warehouse.id
                    }

                    value={
                    warehouse.id
                    }>

                    {
                    warehouse.name
                    }

                    </option>

                    ))
                    }

                    </select>

                </div>

                <div className=
                "mb-6">

                    <label
                    className=
                    "block font-bold text-black mb-2">

                        Initial Stock

                    </label>

                    <input

                    type="number"

                    value={
                    totalUnits
                    }

                    onChange={(e)=>
                    setTotalUnits(
                    e.target.value
                    )}

                    className=
                    "w-full border p-3 rounded text-black"
                    />

                </div>

                <button

                onClick={
                addProduct
                }

                disabled={
                loading
                }

                className=
                "bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"

                >

                    {
                    loading
                    ?

                    "Adding..."

                    :

                    "Add Product"
                    }

                </button>

            </div>

        </main>

        </>

    );

}