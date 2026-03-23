// styling
import "./Tabs.css";

function Tabs({ categories, current, onSelect, variant = "horizontal" }) {
  // categories - tab names
  // current - selected tab
  // onSelect - function runs when tab is clicked
  // variant (horizontal/vertical)
  return (
    <div className={`tabs ${variant === "vertical" ? "tabs-vertical" : ""}`}>
      {/* loop through all categories and create button for each */}
      {categories.map((cat) => (
        // add active class is button is selected
        <button
          key={cat}
          className={`tab-btn ${current === cat ? "active" : ""}`}
          // notify parent about selected tab
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
// export tab
export default Tabs;