import "../assets/css/components/ArticleCard.css";
import { Container, Card, Row, Col, Image, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";

const ArticleCard = (cardData) => {
  const [directionLeft, setDirectionLeft] = useState(null);
  const [directionRight, setDirectionRight] = useState(null);
  const [direction, setDirection] = useState("left");
  let TEXTCUTOFF = cardData?.textcutoff || 500;
  let positiveTags = [];
  let negativeTags = [];

  //dynamically render the amount of tags
  for (let i = 0; i < cardData.tags?.length; i++) {
    positiveTags.push(
      <Col xs="2" className="tag-positive">
        <p className="tag-size">{cardData.tags[i]}</p>
      </Col>
    );
  }

  //dynamically render the amount of negative tags
  for (let i = 0; i < cardData.negativeTags?.length; i++) {
    negativeTags.push(
      <Col xs="2" className="tag-negative">
        <p className="tag-size">{cardData.negativeTags[i]}</p>
      </Col>
    );
  }

  useEffect(() => {
    function changeDirection(dir) {
      if (dir === "left") {
        setDirection("left");
        setDirectionRight(null);
        setDirectionLeft(
          <Col lg={6} className="d-flex image-align-left mb-1">
            <Image
              fluid
              className="noBorder image-max-size"
              src={cardData.image}
              loading="lazy"
              fetchPriority="low"
            ></Image>
          </Col>
        );
      } else if (dir === "right") {
        setDirection("right");
        setDirectionLeft(null);
        setDirectionRight(
          <Col lg={6} className="d-flex image-align-right">
            <Image
              fluid
              className="noBorder image-max-size"
              src={cardData.image}
              loading="lazy"
              fetchPriority="low"
            ></Image>
          </Col>
        );
      }
    }

    function checkWidthAndChangeDir(x) {
      if (x.matches) {
        changeDirection("left");
      } else {
        changeDirection(cardData.pictureDirection);
      }
    }

    const x = window.matchMedia("(max-width: 1200px)");
    checkWidthAndChangeDir(x);
    x.addEventListener("change", () => {
      checkWidthAndChangeDir(x);
    });

    // Cleanup the event listener on component unmount
    return () => {
      x.removeEventListener("change", () => {
        checkWidthAndChangeDir(x);
      });
    };
  }, [cardData.image, cardData.pictureDirection]);

  //if the description text is too long, cut it at the size given in TEXTCUTOFF
  //and display it only as "show more" text
  const [showMore, setShowMore] = useState(false);
  const [showAlways, setShowAlways] = useState(true);

  const [textShown, setTextShown] = useState("");
  const [textHidden, setTextHidden] = useState("");

  useEffect(() => {
    if (cardData.text !== "default") {
      sliceText();
    }
  }, [cardData.text]);

  function sliceText() {
    if (TEXTCUTOFF == -1) {
      setShowAlways(false);
      setTextShown(cardData.text);
      setTextHidden(cardData.text);
    } else if (cardData.text.length > TEXTCUTOFF) {
      setShowMore(true);
      setTextHidden(cardData.text.slice(0, TEXTCUTOFF));
      setTextShown(cardData.text);
    } else {
      setShowAlways(false);
      setTextShown(cardData.text);
      setTextHidden(cardData.text);
    }
  }

  const falseToggle = () => {
    setShowMore(false);
  };
  const trueToggle = () => {
    setShowMore(true);
  };
  return (
    <Container
      fluid
      id={cardData.id}
      className={`background-container ${cardData.extraStyle} ${
        direction === "left"
          ? "background-container-left"
          : "background-container-right"
      }`}
    >
      <Container className="pt-2">
        <Card className="article-card">
          <Card.Body>
            <Row>
              {directionLeft}
              <Col lg={12} xl={6}>
                <Card.Title className="big-headline font-900">
                  {cardData.name}
                </Card.Title>
                <hr className="underline-yellow" />
                <Row>
                  {positiveTags}
                  {negativeTags}
                </Row>

                <Card.Text>
                  <div>
                    {showMore ? (
                      <>
                        {showAlways && (
                          <div>
                            <p className="gradient-text article-text font-600">
                              {textHidden}

                              <span>...</span>
                            </p>
                            <p>
                              <button
                                className="read-more article-button"
                                onClick={falseToggle}
                              >
                                Read More
                              </button>
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <p className="article-text font-600">{textShown}</p>
                        <p>
                          {showAlways && (
                            <button
                              className="read-more article-button"
                              onClick={trueToggle}
                            >
                              Read Less
                            </button>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </Card.Text>
                <hr className="underline-grey" />
                <Stack direction="horizontal" gap={2}></Stack>
                {cardData.button}
              </Col>
              {directionRight}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

ArticleCard.defaultProps = {
  tags: ["addSome", "tags"],
  text: "default",
};

export default ArticleCard;
