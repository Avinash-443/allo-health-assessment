"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

    const pathname =
        usePathname();

    const links = [

        {
            name: "Dashboard",
            href: "/dashboard"
        },

        {
            name: "Reserve",
            href: "/reserve"
        },

        {
            name: "Reservations",
            href: "/reservations"
        },

        {
            name: "Manage Products",
            href: "/products/manage"
        },

        {
            name: "Warehouses",
            href: "/warehouses"
        }

    ];

    return (

        <nav
            className="
            bg-black
            text-white
            px-10
            py-4
            flex
            justify-between
            items-center
            border-b
            border-gray-800
            "
        >

            <h1
                className="
                text-2xl
                font-bold
                text-blue-500
                "
            >
                Inventory System
            </h1>

            <div
                className="
                flex
                gap-4
                flex-wrap
                "
            >

                {
                    links.map((link) => (

                        <Link
                            key={link.href}
                            href={link.href}

                            className={`
                            px-4
                            py-2
                            rounded-lg
                            transition

                            ${
                                pathname === link.href
                                ?
                                "bg-blue-600 text-white"
                                :
                                "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }
                            `}
                        >

                            {link.name}

                        </Link>

                    ))
                }

            </div>

        </nav>

    );
}