import "../assets/css/pages/Article.css";

import { Container, Image, Row, Col, Button, Spinner } from "react-bootstrap";

import ArticleCard from "../components/ArticleCard.jsx";
import ScrollTag from "../components/ScrollTag.jsx";
import MultiCarousel from "../components/MultiCarouselCustom.jsx";
import ArticleOffCanvas from "../components/ArticleOffCanvas.jsx";
import LinkToButton from "../components/LinkToButton.jsx";
import Enquiry from "../components/Enquiry.jsx";

import { useState, useEffect } from "react";
import axios from "axios";
import Banner from "../layouts/Banner.jsx";

import { connections, endpoints } from "../config/connections.js";
import { resourceFolder, images, icons } from "../config/resources.js";

function Article() {
  const topImg = `${resourceFolder.images}${images.articleImage}`;
  const bottomBannerImage = `${resourceFolder.images}${images.articleEnquiryImage}`;
  const bannerImage = `${resourceFolder.images}${images.homePageBannerImage}`;

  const partner1 = `${resourceFolder.images}${images.partner1}`;
  const partner2 = `${resourceFolder.images}${images.partner2}`;
  const partner3 = `${resourceFolder.images}${images.partner3}`;

  const [articles, setListOfArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  let articleCardArray = [];
  // This is the pill linking to the article by href
  let articleTagArray = [];

  // All pictures that need to be displayed in the carousel get added here
  let myPicArray = [partner1, partner2, partner3];
  let partnerNames = [
    "Pawsitive Care Veterinary Clinic",
    "TailWag Nutrition",
    "FurEver Friends Supplies",
  ];

  // This is the advantages and disadvantages pills
  let tagArray = [];
  let negativeTagArray = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          `${connections.server}${endpoints.articles}`
        );
        setListOfArticles(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          console.error("Response error:");
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:");
          console.error(error.request);
        } else {
          // Something else happened setting up the request
          console.error("Axios config error:", error.message);
        }
      }
    };

    fetchData();
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // With the data from the server: iterate over it, format, push as HTML to an array and render
  if (articles != null) {
    for (let i = 0; i < articles.length; i++) {
      tagArray = [];
      negativeTagArray = [];

      let pictureDir = "left";
      let hrefToArticleDetails = `/article-detail/${articles[i].slug}`;
      // Make every other picture align to the right side
      if (i % 2 === 0) {
        pictureDir = "left";
      } else {
        pictureDir = "right";
      }

      articleTagArray.push(
        <ScrollTag
          key={i}
          tagName={articles[i].name}
          id={`#${articles[i].slug}`}
          handleClose={handleClose}
        />
      );

      articleCardArray.push(
        <ArticleCard
          id={`${articles[i].slug}`}
          pictureDirection={pictureDir}
          image={articles[i]?.image || "no image"}
          name={articles[i]?.name || "default name"}
          tags={tagArray}
          negativeTags={negativeTagArray}
          text={articles[i]?.description || "default text"}
          availability={articles[i]?.availability || -1}
          href={hrefToArticleDetails}
          button={
            <LinkToButton
              navLink={hrefToArticleDetails}
              text="Read Entire Article"
            />
          }
        />
      );
    }
  }

  const getWindowWidth = () => window.innerWidth;

  const [isSmallScreen, setIsSmallScreen] = useState(getWindowWidth() <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(getWindowWidth() <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [modalShow, setModalShow] = useState(false);

  function openModal() {
    setModalShow(true);
  }

  return (
    <div>
      <Banner image={bannerImage} />
      <div className="py-5" />

      <Container className="d-flex justify-content-center title-container">
        <Col>
          <Row className="d-flex justify-content-start">
            <h1 className="title-1 white font-900">Green Nest </h1>
          </Row>
          <Row className="d-flex justify-content-end">
            <h1 className="title-3 font-900">Articles </h1>
          </Row>
        </Col>
      </Container>

      <Container className="d-flex justify-content-center mt-3">
        <Image fluid className="article-image-overlay" src={topImg}></Image>
      </Container>
      {loading ? (
        <Container className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" variant="info">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        <>
          <Container>
            <Row className="mt-3 scroll-tag-row">
              {isSmallScreen ? (
                <Container className="scroll-tag-container">
                  <ArticleOffCanvas
                    articleTagArray={articleTagArray}
                    show={show}
                    handleClose={handleClose}
                    handleShow={handleShow}
                  />
                  <Button
                    href="#partners"
                    variant="primary"
                    className="button partner-button"
                  >
                    Our Partners
                  </Button>
                </Container>
              ) : (
                <>
                  {articleTagArray}

                  <Col className="d-flex scroll-tag-col">
                    <Button
                      href="#partners"
                      className="scroll-tag scroll-tag-partner font-400"
                    >
                      Our Partners
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Container>
          <Enquiry modalShow={modalShow} setModalShow={setModalShow} />
          {/*This is the main body component*/}
          {/* --------------------- */}
          <div>{articleCardArray}</div>
          {/* --------------------- */}
          <Container id="partners" className="d-flex justify-content-center">
            <p className="text-nowrap darkblue font-900 partner-text">
              PROUD TO WORK WITH
            </p>
          </Container>
          <MultiCarousel
            pics={myPicArray}
            titles={partnerNames}
            autoPlay={true}
            arrows={true}
            imageStyle={"carouselStyle"}
          />

          <Container fluid className="py-5 mt-5 bottom-banner">
            <Row>
              <Col className="ms-5 d-flex justify-content-start" xs="4">
                <Image
                  className="bottom-banner-image"
                  src={bottomBannerImage}
                  fluid
                />
              </Col>
              <Col className="ms-5" xs="8" md={6}>
                <p className="bottom-banner-p bottom-banner-p-title font-900 white">
                  Got questions about our furry friends or garden treasures?
                </p>

                {/* 5 marign unless less than medium device, then set to 0 margin */}

                <p className="white font-400 bottom-banner-p">
                  Send us an enquiry – we’re here to help and offer expert
                  advice with a smile!
                </p>

                <Button
                  onClick={openModal}
                  className="button button-round white enquire-button font-700 mt-5"
                >
                  Enquire Now
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}

export default Article;
