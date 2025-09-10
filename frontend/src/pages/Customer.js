import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Salon from "../models/Salons";

export default function SalonScreen() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/salons");
        const data = await response.json();
        const loadedSalons = data.salons.map((s) => new Salon(s));
        setSalons(loadedSalons);
      } catch (error) {
        console.error("Error fetching salons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      {/* Navbar */}
      <div className="relative">
        <button className="absolute top-2 right-4 border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
          Sign In
        </button>
        <div className="bg-white border rounded-lg shadow p-3 mt-10 w-fit mx-auto">
          <nav className="flex space-x-4 text-sm">
            <button className="hover:underline">Home</button>
            <button className="hover:underline">Contact</button>
            <button className="hover:underline">Catalog</button>
            <button className="hover:underline">About</button>
            <button className="text-pink-600 font-bold">ChatBot</button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="my-4 flex flex-wrap items-center gap-2">
        <button className="border px-3 py-1 rounded bg-white">
          Service charge
        </button>
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

      {/* Salon List */}
      <div className="space-y-4 mt-4">
        {loading ? (
          <p>Loading salons...</p>
        ) : (
          salons.map((salon) => (
            <button
              key={salon.salon_id}
              onClick={() => navigate(`/salons/${salon.salon_id}`)}
              className="w-full text-left flex items-center space-x-4 p-4 bg-white rounded shadow hover:bg-pink-50 transition"
            >
              <div
                className={`w-16 h-10 ${salon.color || "bg-gray-300"} rounded`}
              />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <span>{salon.name}</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: salon.rating || 0 }).map((_, i) => (
                      <Star key={i} size={16} fill="gold" stroke="gold" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{salon.address}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
