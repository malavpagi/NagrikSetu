import { useNavigate } from "react-router-dom";
import { IconCamera, IconNote, IconGallery, IconList } from "../../components/icons.jsx";

function CitizenMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="ns-menu-intro">
        <p className="ns-page-eyebrow">Citizen desk</p>
        <h2>What would you like to do?</h2>
      </div>

      <div className="ns-menu-grid">
        <button className="ns-menu-tile" onClick={() => navigate('/citizen/capture')}>
          <span className="ns-menu-tile-icon"><IconCamera /></span>
          <span>Capture evidence</span>
        </button>

        <button className="ns-menu-tile" onClick={() => navigate('/citizen/make-complaint')}>
          <span className="ns-menu-tile-icon"><IconNote /></span>
          <span>Make complaint</span>
        </button>

        <button className="ns-menu-tile" onClick={() => navigate('/citizen/evidences')}>
          <span className="ns-menu-tile-icon"><IconGallery /></span>
          <span>My evidence</span>
        </button>

        <button className="ns-menu-tile" onClick={() => navigate('/citizen/my-complaints')}>
          <span className="ns-menu-tile-icon"><IconList /></span>
          <span>My complaints</span>
        </button>
      </div>
    </div>
  );
}

export default CitizenMenu;
