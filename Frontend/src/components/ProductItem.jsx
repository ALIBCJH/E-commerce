// src/components/ProductItem.jsx
import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const ProductItem = ({ product, onDelete, onEdit }) => {
  return (
    <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{product.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">ID: {product._id}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-orange-600 font-bold">
          Ksh {product.price.toLocaleString()}
        </p>
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );
};

export default ProductItem;
