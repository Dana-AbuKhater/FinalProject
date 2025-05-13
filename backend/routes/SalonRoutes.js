const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");
const salons = [
  {
    salon_id: 1,
    owner_email: "owner1@example.com",
    name: "Glamour Touch",
    password: "hashedpassword123",
    type: "salon",
    description: "A modern salon offering all beauty services.",
    address: "123 Main St, Amman",
    phone: "0799999999",
    logo_url: "http://example.com/logo1.png",
    created_at: new Date("2023-08-01T10:00:00Z"),
  },
  {
    salon_id: 2,
    owner_email: "owner2@example.com",
    name: "Beauty Bar",
    password: "hashedpassword456",
    type: "salon",
    description: "Affordable and elegant hair styling.",
    address: "456 Queen Rania St, Irbid",
    phone: "0788888888",
    logo_url: "http://example.com/logo2.png",
    created_at: new Date("2023-09-15T14:30:00Z"),
  },
  {
    salon_id: 3,
    owner_email: "owner3@example.com",
    name: "Luxury Looks",
    password: "hashedpassword789",
    type: "salon",
    description: "Luxury salon with VIP services.",
    address: "789 Gardens St, Zarqa",
    phone: "0777777777",
    logo_url: "http://example.com/logo3.png",
    created_at: new Date("2023-10-10T08:45:00Z"),
  },
];
router.get("/", async (req, res) => {
  try {
    // const salons = await Salon.find().populate("services");

    res.status(200).json({
      success: true,
      salons,
    });
  } catch (error) {
    console.error("Error fetching salons:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/:salon_id", async (req, res) => {
  try {
    const salonId = parseInt(req.params.salon_id);

    const salon = salons.find((s) => s.salon_id === salonId);

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found",
      });
    }

    res.status(200).json({
      success: true,
      salon,
    });
  } catch (error) {
    console.error("Error fetching salon details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const newSalon = new Salon(req.body);
  await newSalon.save();
  res.status(201).json(newSalon);
});

module.exports = router;
