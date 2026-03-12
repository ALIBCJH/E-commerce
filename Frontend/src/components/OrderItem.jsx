// src/components/OrderItem.jsx
import React from "react";

const OrderItem = ({ order }) => {
  return (
    <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
      <p className="font-semibold text-gray-800 dark:text-white">
        Order ID: {order._id}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Customer: {order.customerName} | Total: Ksh {order.total}
      </p>
    </li>
  );
};

export default OrderItem;
