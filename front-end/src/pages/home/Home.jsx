import "./Home.css";
import SideMedia from "../../assets/SideMedia.jpg";
import KhanAcademy from "../../assets/KhanAcademy.png";
import Kahoot from "../../assets/Kahoot.png";
import Google from "../../assets/Google.png";
import Nav from "../../components/nav/Nav.jsx";

function Home() {
  return (
    <>
      <Nav />
      <div className="top">
        <div className="main">
          <div className="main_title">A Digital Data Collection Service</div>
          <div className="main_subtitle">
            Providing Schools with Seamless Data Storage and Search <br /> We
            build ready made databases and applications
          </div>
          <a href="/dashboard">
            <button>Access your Dashboard</button>
          </a>
        </div>

        <img className="side_media" src={SideMedia} />
      </div>
      <div className="bottom">
        <div className="secondary">
          <h1 className="secondary_title">Our Clients</h1>
          <div className="secondary_subtitle">
            <div>Several selected clients, who already</div>
            <div>believe in our service.</div>
          </div>
        </div>
        <div className="partners">
          <img className="partner_media" src={KhanAcademy} />
          <img className="partner_media" src={Kahoot} />
          <img className="partner_media" src={Google} />
        </div>
      </div>
    </>
  );
}

export default Home;
