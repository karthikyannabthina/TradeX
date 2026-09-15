import { useState } from "react";
import "./Orders.css";

import ordersData from "./ordersData";
import OrderSummary from "./OrderSummary";
import OrderFilters from "./OrderFilters";
import OrdersTable from "./OrdersTable";
import EmptyState from "./EmptyState";
import OrderModal from "./OrderModal";
import NewOrderModal from "./NewOrderModal";

export default function Orders() {

  // Orders State
  const [orders, setOrders] = useState(ordersData);

  // Filter States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  // Selected Order (View Modal)
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New Order Modal
  const [showNewOrder, setShowNewOrder] = useState(false);

  // Add New Order
  function addOrder(newOrder) {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  }

  // Filter Orders
  const filteredOrders = orders.filter((order) => {

    const matchesSearch =
      order.stock.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || order.status === status;

    const matchesType =
      type === "All" || order.type === type;

    return matchesSearch && matchesStatus && matchesType;

  });

  return (
    <div className="orders-page">

      {/* Header */}

      <div className="orders-header">

        <div>
          <h1>Orders</h1>
          <p>Manage and track all your stock orders.</p>
        </div>

        <button
          className="new-order-btn"
          onClick={() => setShowNewOrder(true)}
        >
          + New Order
        </button>

      </div>

      {/* Summary */}

      <OrderSummary orders={filteredOrders} />

      {/* Filters */}

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        type={type}
        setType={setType}
      />

      {/* Table */}

      {filteredOrders.length > 0 ? (
        <OrdersTable
          orders={filteredOrders}
          onView={setSelectedOrder}
        />
      ) : (
        <EmptyState />
      )}

      {/* View Order Modal */}

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* New Order Modal */}

      {showNewOrder && (
        <NewOrderModal
          onClose={() => setShowNewOrder(false)}
          onAddOrder={addOrder}
        />
      )}

    </div>
  );
}