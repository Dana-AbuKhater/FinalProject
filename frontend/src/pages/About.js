import React from "react";
import "./About.css";
import { Container } from "react-bootstrap";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <h1 className="hero-title">STYLE HIVE</h1>
          <p className="hero-subtitle">
            Jordan's Beauty Salons Network — Powered by 3 Web Developers
          </p>
        </Container>
      </section>

      {/* About Project */}
      <section className="about-section">
        <Container>
          <h2 className="section-title">About Our Project</h2>
          <div className="about-card">
            <p className="about-text">
              Jordan Beauty Salons Network is the leading beauty and wellness platform in Jordan,
              connecting customers with premium beauty services across major cities including Amman,
              Zarqa, and Irbid. Our network of professional salons offers a comprehensive range of
              services including traditional Jordanian beauty treatments, modern hair styling,
              massage therapy, and spa services. We pride ourselves on maintaining the highest
              standards of service quality and customer satisfaction. Our Vision: To be Jordan's
              most trusted beauty and wellness network, delivering exceptional services that blend
              traditional Jordanian beauty practices with modern techniques.
            </p>
          </div>
        </Container>
      </section>

      {/* Meet the Developers */}
      <div className="section-title">Meet The Developers</div>
      <div className="dev-cards">
        <div className="about-card dev-card">
          
          <h3 className="dev-name">Eman Alomari</h3>
          <p className="dev-role">Front-End Developer</p>
          <p className="about-text">Professional and elegant website interfaces creator.</p>
        </div>

        <div className="about-card dev-card">
          
          <h3 className="dev-name">Raghad Abuhammmam</h3>
          <p className="dev-role">Back-End Developer</p>
          <p className="about-text">Specialized in building databases and servers with great professionalism.</p>
        </div>

        <div className="about-card dev-card">
          
          <h3 className="dev-name">Dana Abu-kater</h3>
          <p className="dev-role">Full-Stack Developer</p>
          <p className="about-text">Expert in developing integrated websites from frontend to API.</p>
        </div>
      </div>
a


      {/* Vision */}
      <section className="cta-section">
        <Container>
          <h2 className="cta-title">Our Vision</h2>
          <p className="cta-text">
            To become Jordan’s most trusted digital beauty network —
            delivering excellence in every click.
          </p>
        </Container>
      </section>
    </div>
  );
};

export default About;
