"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/api";

export default function OfferForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    cropName: "",
    category: "",
    price: "",
    weight: "",
    location: "",
    postHarvest: "",
  });
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const baseUrl = process.env.NEXT_PUBLIC_API || "http://127.0.0.1:5555";
>>>>>>> 262cf45 (Added AI chat)

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
      const body = {
        crop_name: cropName,
        category,
        quantity: weight,
        price,
        location,
        post_harvest_period: postHarvest,
      };
      // Optional dev fallback: include farmer_id from env to avoid third-party cookie issues on localhost
      const fallbackFarmerId = process.env.NEXT_PUBLIC_FALLBACK_FARMER_ID
        ? Number(process.env.NEXT_PUBLIC_FALLBACK_FARMER_ID)
        : NaN;
      if (Number.isFinite(fallbackFarmerId) && fallbackFarmerId > 0) {
        body.farmer_id = fallbackFarmerId;
      }

      const headers = {};
      if (Number.isFinite(fallbackFarmerId) && fallbackFarmerId > 0) {
        headers["X-Farmer-Id"] = String(fallbackFarmerId);
      }

      const data = await fetchJson(`/offer`, {
        method: "POST",
        headers,
        body,
      });
      toast.success(data?.message || "Offer created successfully");

      setForm({ cropName: "", category: "", price: "", weight: "", location: "", postHarvest: "" });

      if (action === "create") {
        toast.success("Redirecting to Orders…");
        router.push("/orders?created=1");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Network error creating offer");
    } finally {
      setLoading(false);
    }
  };

  const testFetchOffers = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const list = await fetchJson(`/offer`, { method: "GET" });
      console.log("Created offers:", list);
      toast.success(`Fetched ${Array.isArray(list) ? list.length : 0} offers`);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Network error fetching offers");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-2xl border-2 border-green-800 px-5 py-4 text-green-900 placeholder:text-green-700/70 focus:outline-none";

  const label = "block mb-2 font-semibold text-green-900";

  return (
    <div className="py-10">
      <form id="offer-form" onSubmit={handleSubmit} className="bg-[#F4F7F4] rounded-3xl p-6" aria-busy={loading}>
        <div>
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
                  <option>Cereals</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Export Crop</option>
                  <option>Other</option>
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
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            form="offer-form"
            type="submit"
            data-action="create"
            className="sm:flex-1 rounded-2xl bg-[#CFF56A] text-green-900 font-semibold px-6 py-4 hover:brightness-95"
          >
            Add Offer
          </button>
          <button
            form="offer-form"
            type="submit"
            data-action="create-new"
            className="sm:flex-1 rounded-2xl border-2 bg-green-800 border-green-800 text-neutral-50 font-semibold px-6 py-4 hover:bg-green-700"
          >
            Add & Create New Offer
          </button>
        </div>
      </form>

    </div>
  );
}

