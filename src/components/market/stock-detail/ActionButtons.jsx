"use client";

export default function ActionButtons({
  stock,
  onClose,
}) {
  return (
    <div className="flex items-center justify-between border-t px-6 py-6">

      {/* GTT */}
      <button
        className="
          rounded border border-blue-500
          px-6 py-2
          text-blue-500
          transition
          hover:bg-blue-50
        "
        onClick={() => {
          console.log("Create GTT:", stock.symbol);
        }}
      >
        Create GTT
      </button>


      {/* Actions */}
      <div className="flex gap-3">

        <button
          className="
            rounded border border-blue-500
            px-8 py-2
            text-blue-500
            transition
            hover:bg-blue-50
          "
          onClick={() => {
            console.log("BUY:", stock.symbol);
          }}
        >
          Buy
        </button>


        <button
          className="
            rounded border border-red-500
            px-8 py-2
            text-red-500
            transition
            hover:bg-red-50
          "
          onClick={() => {
            console.log("SELL:", stock.symbol);
          }}
        >
          Sell
        </button>


        <button
          className="
            rounded border border-gray-400
            px-8 py-2
            text-gray-600
            transition
            hover:bg-gray-100
          "
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>
  );
}