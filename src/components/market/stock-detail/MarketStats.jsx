export default function MarketStats({ stats }) {
  return (
    <div className="mx-6 border-t bg-gray-50 px-5 py-5">

      <div className="grid grid-cols-2 gap-x-20 gap-y-3">

        <Stat
          label="Open"
          value={format(stats.open)}
        />

        <Stat
          label="Prev. Close"
          value={format(stats.prevClose)}
        />

        <Stat
          label="Low"
          value={format(stats.low)}
        />

        <Stat
          label="High"
          value={format(stats.high)}
        />

        <Stat
          label="Volume"
          value={stats.volume ?? "N/A"}
        />

        <Stat
          label="Avg. price"
          value={stats.avgPrice ?? "N/A"}
        />

        <Stat
          label="Lower circuit"
          value={format(stats.lowerCircuit)}
        />

        <Stat
          label="Upper circuit"
          value={format(stats.upperCircuit)}
        />

        <Stat
          label="LTQ"
          value={stats.ltq ?? "N/A"}
        />

        <Stat
          label="LTT"
          value={stats.ltt ?? "N/A"}
        />

      </div>

      {/* High / Low indicator */}
      <div className="mt-5">

        <div className="relative h-1 bg-gray-300">

          <div className="absolute left-[12%] right-[4%] h-1 bg-green-500" />

          <div className="absolute left-[12%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-500" />

          <div className="absolute right-[4%] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-500" />

        </div>

      </div>

    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-gray-600">
        {value}
      </span>

    </div>
  );
}


function format(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}