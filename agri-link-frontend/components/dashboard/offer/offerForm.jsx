"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function OfferForm() {
  const [form, setForm] = useState({
    cropName: "",
    category: "",
    price: "",
    weight: "",
    location: "",
    postHarvest: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Offer submitted:", form);
  };

  const inputBase =
    "w-full rounded-2xl border-2 border-green-800 px-5 py-4 text-green-900 placeholder:text-green-700/70 focus:outline-none";

  const label = "block mb-2 font-semibold text-green-900";

  return (
    <div className="bg-[#F4F7F4] rounded-3xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Crop Name:</label>
            <input
              className={inputBase}
              name="cropName"
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
              value={form.postHarvest}
              onChange={handleChange}
              placeholder="0 Months"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className="sm:flex-1 rounded-2xl bg-[#CFF56A] text-green-900 font-semibold px-6 py-4 hover:brightness-95"
          >
            Add Offer
          </button>
          <button
            type="button"
            className="sm:flex-1 rounded-2xl border-2 border-green-800 text-green-800 font-semibold px-6 py-4 hover:bg-green-50"
          >
            Add & Create New Offer
          </button>
        </div>
      </form>
    </div>
  );
}
