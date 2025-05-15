import "../assets/css/pages/AboutUs.css";

import { Row, Col, Image, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import Banner from "../layouts/Banner";

import AboutUsListItem from "../components/AboutUsListItem";

import { resourceFolder, images, icons } from "../config/resources";

const AboutUs = () => {
  // icon paths
  const fbIconPath = `${resourceFolder.icons}${icons.fb}`;
  const linkedIconPath = `${resourceFolder.icons}${icons.linkedin}`;
  const igIconPath = `${resourceFolder.icons}${icons.ig}`;

  // image paths
  const aboutUsBannerPath = `${resourceFolder.images}${images.contactUsBanner}`;
  const aboutUsBottom = `${resourceFolder.images}${images.aboutUsBottom}`;

  return (
    <div className="px-2 pt-2">
      <Banner image={aboutUsBannerPath} height={"19rem"} />
      <div className="py-5" />
      <Container className="d-flex justify-content-center py-5">
        <p className="p-0 title white font-400">About</p>
        <span className="p-0 mx-2 title yellow font-400">Us</span>
      </Container>

      <div className="py-4" />

      <Container>
        <Row
          s={12}
          className="d-flex align-items-stretch justify-content-between flex-wrap gy-3 gy-md-0"
        >
          <Col md={8} className="p-0">
            <div className="p-5 card-background-1 h-100 w-100">
              <div className="d-flex flex-column justify-content-center h-100 w-100">
                <div className="py-1 card-subtitle font-600">
                  The Green Nest
                </div>
                <p className="py-1 about-us-card-title white font-700">
                  Where wagging tails meet blooming trails.
                </p>

                <p className="m-0 card-text-1 white">
                  At The Green Nest, we believe that a happy home starts in the
                  garden and thrives with our furry friends. Whether you're
                  nurturing your backyard oasis or caring for your beloved pets,
                  we're here to make every moment more joyful, simple, and
                  beautiful. From eco-friendly garden tools to cozy essentials
                  for your four-legged companions, our products are thoughtfully
                  selected to bring nature and comfort together. We're
                  passionate about helping you grow, play, and connect—both
                  outdoors and at home.
                  <br />
                  <br />
                  Rooted in care, inspired by nature, and made for the ones you
                  love—welcome to The Green Nest.
                </p>
              </div>
            </div>
          </Col>

          <Col md={3} className="p-0 ms-md-4 me-md-4">
            <div className="card-background-2 h-100 w-100">
              <div className="py-3 mx-5">
                <div>
                  <AboutUsListItem text="Excellent Prices" />
                  <AboutUsListItem text="Fast Shipping" />
                  <AboutUsListItem text="Pet Friendly" />
                  <AboutUsListItem text="Garden Ready" />
                  <AboutUsListItem text="Eco Choices" />
                </div>
                <div className="d-flex align-items-center justify-content-center py-2">
                  <AboutUsListItem
                    text="Social Media"
                    showCaptionLine={false}
                  />
                  <Link to="/">
                    <Image className="px-2" src={fbIconPath} />
                  </Link>
                  <Link to="/">
                    <Image className="px-2" src={linkedIconPath} />
                  </Link>

                  <Link to="/">
                    <Image className="px-2" src={igIconPath} />
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container fluid className="py-5">
        <div className="how-we-work darkblue font-900 d-flex justify-content-center text-uppercase">
          Our History
        </div>
        <Container className="about-us-container">
          <p className="about-us-content">
            Founded in 2008 by Fake Name, our story began with a simple passion:
            creating a space where pets and plants could thrive together. It all
            started in a small backyard, where Fake Name discovered the perfect
            harmony between nurturing lush gardens and caring for their own
            furry companions. Frustrated by the lack of products that catered to
            both, they set out to build a shop that prioritized quality,
            sustainability, and the well-being of pets and plants alike.
          </p>
          <p className="about-us-content">
            Today, The Green Nest is a trusted destination for garden
            enthusiasts and pet lovers. We curate eco-friendly tools, organic
            pet supplies, and unique garden decor designed to inspire a greener,
            happier lifestyle. Every product is chosen with care, reflecting our
            belief that a thriving garden and a happy pet go hand in hand.
          </p>
        </Container>
        <Container className="justify-content-center d-flex mt-3">
          <Image
            fluid
            rounded
            src={aboutUsBottom}
            style={{ maxWidth: "30rem" }}
          ></Image>
        </Container>
      </Container>
    </div>
  );
};

export default AboutUs;
