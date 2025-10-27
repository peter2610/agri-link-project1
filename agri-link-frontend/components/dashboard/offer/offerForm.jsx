"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";

export default function OfferForm() {
  const [form, setForm] = useState({
    cropName: "",
    category: "",
    price: "",
    weight: "",
    location: "",
    postHarvest: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e?.nativeEvent?.submitter?.dataset?.action || "create";
    console.log("Offer submitted:", form, "action:", action);

    // Runtime validation
    const cropName = form.cropName.trim();
    const category = form.category.trim();
    const price = Number(form.price);
    const weight = Number(form.weight);
    const location = form.location.trim();
    const postHarvest = Number(form.postHarvest);

    if (!cropName) return toast.error("Please enter the crop name");
    if (!category) return toast.error("Please select a crop category");
    if (!Number.isFinite(price) || price <= 0) return toast.error("Please enter a valid price greater than 0");
    if (!Number.isFinite(weight) || weight <= 0) return toast.error("Please enter a valid weight greater than 0");
    if (!location) return toast.error("Please add a location");
    if (!Number.isFinite(postHarvest) || postHarvest < 0) return toast.error("Please enter a valid post harvest period");

    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName,
          category,
          price,
          weight,
          location,
          postHarvest,
        }),
      });

      if (!res.ok) {
        const errMsg = (await res.json().catch(() => null))?.message || "Failed to create offer";
        return toast.error(errMsg);
      }

      const data = await res.json();
      toast.success(data?.message || "Offer created successfully");

      if (action === "create-new") {
        setForm({ cropName: "", category: "", price: "", weight: "", location: "", postHarvest: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error creating offer");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-2xl border-2 border-green-800 px-5 py-4 text-green-900 placeholder:text-green-700/70 focus:outline-none";

  const label = "block mb-2 font-semibold text-green-900";

  return (
    <form id="offer-form" onSubmit={handleSubmit} className="bg-[#F4F7F4] rounded-3xl p-6" aria-busy={loading}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Crop Name:</label>
            <input
              className={inputBase}
              name="cropName"
              type="text"
              required
              value={form.cropName}
              onChange={handleChange}
              placeholder="Insert Name"
            />
          </div>
          <div>
            <label className={label}>Crop Category:</label>
            <div className="relative">
              <select
                className={`${inputBase} appearance-none pr-10`}
                name="category"
                required
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>Grains</option>
                <option>Fruits</option>
                <option>Vegetables</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-green-900" size={18} />
            </div>
          </div>
          <div>
            <label className={label}>Price:</label>
            <input
              className={inputBase}
              name="price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              required
              value={form.price}
              onChange={handleChange}
              placeholder="KSH 0.00"
            />
          </div>
          <div>
            <label className={label}>Weight:</label>
            <input
              className={inputBase}
              name="weight"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              required
              value={form.weight}
              onChange={handleChange}
              placeholder="0.00 KG"
            />
          </div>
          <div>
            <label className={label}>Location:</label>
            <input
              className={inputBase}
              name="location"
              type="text"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="Add Location"
            />
          </div>
          <div>
            <label className={label}>Post Harvest Period:</label>
            <input
              className={inputBase}
              name="postHarvest"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              required
              value={form.postHarvest}
              onChange={handleChange}
              placeholder="0 Months"
            />
          </div>
        </div>
    </form>
  );
}
