import { useEffect, useState } from "react";
import "./Orders.css";

import { getOrders } from "../../services/orderServiceClient";

import OrderSummary from "./OrderSummary";
import OrderFilters from "./OrderFilters";
import OrdersTable from "./OrdersTable";
import EmptyState from "./EmptyState";
import OrderModal from "./OrderModal";
import NewOrderModal from "./NewOrderModal";

export default function Orders() {
  // Orders State
  const [orders, setOrders] = useState([]);

  // Loading State
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  // Selected Order (View Modal)
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New Order Modal
  const [showNewOrder, setShowNewOrder] = useState(false);

  // Fetch Orders
 useEffect(() => {
  console.log("ORDERS PAGE LOADED");

  const fetchOrders = async () => {
    console.log("FETCHING ORDERS");

    try {
      const response = await getOrders();

     console.log(
  "ORDERS RESPONSE:",
  JSON.stringify(response, null, 2)
);

      const data = response?.data || response || [];

      setOrders(data);
    } catch (error) {
      console.error("FAILED TO FETCH ORDERS:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  // Add New Order
  function addOrder(newOrder) {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  }

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const stockName = order.stock || order.symbol || "";

    const matchesSearch =
      stockName.toLowerCase().includes(search.toLowerCase());

    const orderStatus = order.status || "";

    const orderType = order.type || order.side || "";

    const matchesStatus =
      status === "All" || orderStatus === status;

    const matchesType =
      type === "All" || orderType === type;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>Manage and track all your stock orders.</p>
          </div>
        </div>

        <p>Loading orders...</p>
      </div>
    );
  }

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