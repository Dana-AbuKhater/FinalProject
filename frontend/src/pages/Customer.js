import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Salon from "../models/Salons";
import "./Customer.css";

export default function SalonScreen() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/salon/getsalons");
        const data = await res.json();
        if (data.success) {
          const loadedSalons = data.salons.map((s) => new Salon(s));
          setSalons(loadedSalons);
        } else {
          alert(data.message || "Failed to load salons");
        }
      } catch (err) {
        console.error("Error fetching salons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  return (
    <div className="salon-container">
      {/* Filters */}
      <div className="filters-bar">
        {/* استبدل الزرين بزر select بنفس الكلاسات */}
        <select className="filter-select" aria-label="Service charge">
          <option>Service charge</option>
          {/* ممكن تضيف خيارات هنا لو حبيت */}
        </select>
        <select className="filter-select" aria-label="Discount">
          <option>Discount</option>
          {/* ممكن تضيف خيارات هنا لو حبيت */}
        </select>

        {/* باقي الفلاتر */}
        <select className="filter-select" aria-label="Category">
          <option>Category</option>
        </select>
        <select className="filter-select" aria-label="Location">
          <option>Location</option>
        </select>
        <select className="filter-select" aria-label="Rating">
          <option>Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
      </div>

      {/* Salon List */}
      <div className="salon-list">
        {loading ? (
          <p className="loading-text">Loading salons...</p>
        ) : (
          salons.map((salon) => (
            <button
              key={salon.salon_id}
              onClick={() => navigate(`/salons/${salon.salon_id}`)}
              className="salon-card"
            >
              <div
                className={`salon-color-box ${salon.color || "bg-gray-300"}`}
              />
              <div className="salon-info">
                <div className="salon-header">
                  <span>{salon.name}</span>
                  <div className="salon-rating">
                    {Array.from({ length: salon.rating || 0 }).map((_, i) => (
                      <Star key={i} size={16} fill="gold" stroke="gold" />
                    ))}
                  </div>
                </div>
                <p className="salon-address">{salon.address}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
