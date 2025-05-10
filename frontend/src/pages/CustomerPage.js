import React from "react";
import { Star } from "lucide-react";

const salons = [
  { name: "Salon1", color: "bg-gray-400", rating: 5 },
  { name: "Salon2", color: "bg-blue-400", rating: 4 },
  { name: "Salon3", color: "bg-pink-400", rating: 3 },
  { name: "Salon4", color: "bg-red-400", rating: 2 },
];

export default function SalonScreen() {
  return (
    <div className="min-h-screen bg-pink-100 p-4">
      {/* Navbar */}
      {/* Navbar */}
      {/* Navbar Container
<div className="relative"> */}
      {/* Sign In Button at top-right
  <button className="absolute top-2 right-4 border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
    Sign In
  </button> */}

      {/* Nav Bar Box 
  <div className="bg-white border rounded-lg shadow p-3 mt-10 w-fit mx-auto">
    <nav className="flex space-x-4 text-sm">
      <button className="hover:underline">Home</button>
      <button className="hover:underline">Contact</button>
      <button className="hover:underline">Catalog</button>
      <button className="hover:underline">About</button>
      <button className="text-pink-600 font-bold">ChatBot</button>
    </nav>
  </div>
</div>*/}



      {/* Filters */}
      <div className="my-4 flex flex-wrap items-center gap-2">
        <button className="border px-3 py-1 rounded bg-white">Service charge</button>
        <button className="border px-3 py-1 rounded bg-white">Discount</button>
        <select className="border rounded p-1">
          <option>Category</option>
        </select>
        <select className="border rounded p-1">
          <option>Location</option>
        </select>
        <select className="border rounded p-1 bg-white">
          <option>Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>

      </div>

      {/* Salon list */}
      <div className="space-y-4 mt-4">
        {salons.map((salon, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <div className={`w-16 h-10 ${salon.color} rounded`} />
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>{salon.name}</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: salon.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="gold" stroke="gold" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
