import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="ns-landing">
      <div className="ns-landing-inner">
        <div className="ns-landing-seal">नस</div>
        <h1>Nagrik Setu</h1>
        <p>
          Report civic issues with photo evidence and a location, and follow
          them through to resolution — one register for citizens and the
          departments who act on their behalf.
        </p>
        <div className="ns-landing-actions">
          <button className="btn btn-primary" onClick={() => { navigate('/register') }}>Register</button>
          <button className="btn btn-outline" onClick={() => { navigate('/login') }}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
