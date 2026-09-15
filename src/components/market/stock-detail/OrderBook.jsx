export default function OrderBook({ orderBook }) {
  const { bids, offers } = orderBook;

  const totalBidQuantity = bids.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalOfferQuantity = offers.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="grid grid-cols-2 gap-6 px-6 py-4">

      {/* BID */}
      <div>

        <div className="grid grid-cols-3 pb-2 text-sm text-gray-400">
          <span>Bid</span>
          <span className="text-center">Orders</span>
          <span className="text-right">Qty.</span>
        </div>

        <div className="space-y-1">

          {bids.map((bid, index) => (
            <div
              key={index}
              className="grid grid-cols-3 py-1 text-sm"
            >
              <span className="text-blue-500">
                {bid.price.toFixed(2)}
              </span>

              <span className="text-center">
                {bid.orders}
              </span>

              <span className="text-right">
                {bid.quantity}
              </span>
            </div>
          ))}

        </div>

        <div className="mt-2 grid grid-cols-3 border-t pt-2 text-blue-500">
          <span>Total</span>

          <span></span>

          <span className="text-right">
            {totalBidQuantity}
          </span>
        </div>

      </div>


      {/* OFFER */}
      <div>

        <div className="grid grid-cols-3 pb-2 text-sm text-gray-400">
          <span>Offer</span>
          <span className="text-center">Orders</span>
          <span className="text-right">Qty.</span>
        </div>

        <div className="space-y-1">

          {offers.map((offer, index) => (
            <div
              key={index}
              className="grid grid-cols-3 py-1 text-sm"
            >
              <span className="text-red-500">
                {offer.price.toFixed(2)}
              </span>

              <span className="text-center">
                {offer.orders}
              </span>

              <span className="text-right">
                {offer.quantity}
              </span>
            </div>
          ))}

        </div>

        <div className="mt-2 grid grid-cols-3 border-t pt-2 text-red-500">
          <span>Total</span>

          <span></span>

          <span className="text-right">
            {totalOfferQuantity}
          </span>
        </div>

      </div>

    </div>
  );
}