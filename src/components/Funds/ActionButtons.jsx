import {
  FaPlus,
  FaArrowUp,
  FaFileDownload
} from "react-icons/fa";

export default function ActionButtons() {
  return (
    <div className="actions">

      <button className="primary-btn">
        <FaPlus />
        Add Funds
      </button>

      <button className="secondary-btn">
        <FaArrowUp />
        Withdraw
      </button>

      <button className="secondary-btn">
        <FaFileDownload />
        Statement
      </button>

    </div>
  );
}