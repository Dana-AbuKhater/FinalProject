import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Salon from "../models/Salons";
import "./Customer.css";

export default function SalonScreen() {
  const [salons, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // States الجديدة للفلاتر
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");


  const navigate = useNavigate();

  /*useEffect(() => {
    const fetchSalons = async () => {
      
//شغل رغد بدون فلتره 
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
  }, []);*/
  // --- دالة جلب البيانات مع الفلاتر ---
  const fetchSalonsOrServices = async () => {
    setLoading(true); // بنحط loading true أول ما نبدأ الجلب
    try {
      const queryParams = new URLSearchParams();
      if (location) queryParams.append("location", location);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (category) queryParams.append("category", category);

      const queryString = queryParams.toString();
      const url = `http://localhost:3000/api/salon/getsalons${queryString ? `?${queryString}` : ""}`;

      console.log("Fetching data from URL:", url); // عشان نشوف الـ URL بالضبط

      const res = await fetch(url);
      const result = await res.json(); // جلب الـ JSON response

      if (result.success) {
        // بناءً على الـ Backend API، ممكن يرجع 'salons' أو 'services'
        if (result.salons) {
          console.log("Received Salons:", result.salons);
          setData(result.salons); // ✅ تخزين الصالونات في الـ 'data' state
        } else if (result.services) {
          console.log("Received Services:", result.services);
          setData(result.services); // ✅ تخزين الخدمات في الـ 'data' state
        } else {
          setData([]); // لو ما في أي بيانات (لا صالونات ولا خدمات)
        }
      } else {
        alert(result.message || "Failed to load data");
        setData([]); // تفريغ البيانات في حالة الفشل
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("An error occurred while fetching data.");
      setData([]); // تفريغ البيانات في حالة وجود خطأ
    } finally {
      setLoading(false); // بنحط loading false لما نخلص الجلب (سواء نجح أو فشل)
    }
  };

  // --- useEffect لاستدعاء الدالة عند تغيير أي فلتر ---
  // هذا الـ useEffect رح يشتغل مرة واحدة عند تحميل الـ component
  // ورح يرجع يشتغل كل ما تتغير قيمة أي من الـ dependencies (location, minPrice, maxPrice, category)
  useEffect(() => {
    fetchSalonsOrServices();
  }, [location, minPrice, maxPrice, category]);

  // --- Handlers لتغيير قيم الفلاتر ---
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    const value = e.target.value;
    if (value === "") { // لما يختار "All Prices"
      setMinPrice("");
      setMaxPrice("");
    } else if (value === "100+") { // لما يختار "100+"
      setMinPrice("100");
      setMaxPrice(""); // ما في حد أقصى
    } else {
      // الفئات مثل "1-10", "11-20"
      const [min, max] = value.split("-").map(Number);
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // --- دالة مساعدة لتحديد إذا كان العنصر المعروض صالون أو خدمة ---
  const isSalon = (item) => {
    // الصالونات عندها 'address' و 'name' مباشرة
    // الخدمات عندها 'price' و 'salonDetails'
    return item.address !== undefined && item.price === undefined;
  };

  return (
    <div className="salon-container">
      {/* Filters */}
      <div className="filters-bar">
        {/* استبدل الزرين بزر select بنفس الكلاسات */}
        <select className="filter-select" aria-label="Service charge" onChange={handlePriceRangeChange} value={`${minPrice}-${maxPrice}`}>
            <option>Service charge</option>
          <option value="">All Prices</option>
          <option value="1-10">1 - 10</option>
          <option value="11-20">11 - 20</option>
          <option value="21-30">21 - 30</option>
          <option value="31-40">31 - 40</option>
          <option value="41-50">41 - 50</option>
          <option value="51-60">51 - 60</option>
          <option value="61-70">61 - 70</option>
          <option value="71-80">71 - 80</option>
          <option value="81-90">81 - 90</option>
          <option value="91-100">91 - 100</option>
        </select>
        <select className="filter-select" aria-label="Discount">
          <option>Discount</option>
        </select>

        <select className="filter-select" aria-label="Category" onChange={handleCategoryChange} value={category}>
          <option value="">Category</option>
          <option value="hair">Hair</option>
          <option value="nails">Nails</option>
          <option value="skin">Skin</option>
          <option value="other">Other</option>
        </select>
        {/*<select className="filter-select" aria-label="Location">
          <option>Location</option>
        </select>*/}
        <select
          className="filter-select"
          aria-label="Location"
          value={location}
          onChange={handleLocationChange}        >
          <option value="">Select a city</option>
          <option value="Amman">Amman</option>
          <option value="Irbid">Irbid</option>
          <option value="Zarqa">Zarqa</option>
          <option value="Aqaba">Aqaba</option>
          <option value="Madaba">Madaba</option>
          <option value="Jerash">Jerash</option>
          <option value="Ajloun">Ajloun</option>
          <option value="Mafraq">Mafraq</option>
          <option value="Karak">Karak</option>
          <option value="Tafilah">Tafilah</option>
          <option value="Ma'an">Ma'an</option>
          <option value="Balqa">Balqa</option>
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
