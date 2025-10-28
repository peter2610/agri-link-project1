"use client";

import React from "react";

export default function CropRow({ crop, index }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-center text-gray-700">{index + 1}</td>
      <td className="px-4 py-3 text-gray-800">{crop.name}</td>
      <td className="px-4 py-3 text-gray-700">{crop.price}</td>
      <td className="px-4 py-3 text-gray-700">{crop.demand}</td>
      <td className="px-4 py-3 text-gray-700">{crop.contributedWeight}</td>
    </tr>
  );
}
