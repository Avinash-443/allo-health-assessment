"use client";

import Link from "next/link";

export default function Navbar() {

    return (

        <nav
            className="
            bg-black
            text-white
            px-10
            py-4
            flex
            justify-between
            "
        >

            <h1
                className="
                text-xl
                font-bold
                "
            >
                Inventory System
            </h1>

            <div
                className="
                flex
                gap-6
                "
            >

                <Link
                    href="/dashboard"
                >
                    Dashboard
                </Link>

                <Link
                    href="/reserve"
                >
                    Reserve
                </Link>

                <Link
                    href="/reservations"
                >
                    Reservations
                </Link>

            </div>

        </nav>

    );
}