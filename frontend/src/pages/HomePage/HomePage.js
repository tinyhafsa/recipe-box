import { Link } from "react-router-dom";
import './HomePage.css'

function HomePage() {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <h1>Recipe Box</h1>
        <p>Store, organize, and view your favorite recipes!</p>
        <div className="home-preview">
          <div className="home-buttons">
          <Link to="/register"><button>Open Recipe Box</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
