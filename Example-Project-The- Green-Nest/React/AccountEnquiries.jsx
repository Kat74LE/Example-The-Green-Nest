import "../assets/css/pages/Profile.css";

import { useAuth } from "../context/AuthContext";
import Banner from "../layouts/Banner";
import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import ProfileTabs from "../components/ProfileTabs";
import EnquiriesTable from "../components/EnquiriesTable";
import Cookies from "js-cookie";
import axios from "axios";
import { connections, endpoints } from "../config/connections";
import Enquiry from "../components/Enquiry";
import { resourceFolder, images } from "../config/resources";
import { useNavigate } from "react-router-dom";

function AccountEnquiries() {
  const bannerImage = `${resourceFolder.images}${images.profilePageBannerImage}`;
  const CURRENT_ENQUIRY = "general";
  const { currentUser, setError } = useAuth();
  const [userEnquiries, setUserEnquiries] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const navigate = useNavigate();

  function openModal() {
    setModalShow(true);
  }

  const updateUserEnquiry = (userEnquiryID, updatedEnquiryData) => {
    // Find the userEnquiry with the given ID
    const foundEnquiry = userEnquiries.find(
      (enquiry) => enquiry.userEnquiryID === userEnquiryID
    );

    if (foundEnquiry) {
      // Update the found userEnquiry
      const updatedEnquiries = userEnquiries.map((enquiry) => {
        if (enquiry.userEnquiryID === userEnquiryID) {
          return {
            ...enquiry,
            ...updatedEnquiryData,
          };
        }
        return enquiry;
      });

      setUserEnquiries(updatedEnquiries);
    } else {
      console.error(`User enquiry with ID ${userEnquiryID} not found.`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userIDCookie = Cookies.get("userID");
      if (userIDCookie) {
        const user = currentUser;

        if (user) {
          try {
            setShowSpinner(true);
            const bearerToken = await user.getIdToken();

            //Check if the bearer token is available before making the request
            if (bearerToken) {
              const response = await axios.get(
                `${connections.server}${endpoints.enquiriesByUserID}/${userIDCookie}`,
                {
                  headers: {
                    Authorization: `Bearer ${bearerToken}`,
                  },
                }
              );
              setUserEnquiries(response.data);
              setLoadingDetails(false);
            } else {
              console.error("Error: Bearer token not available");
            }
          } catch (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error(
                `Server error: ${error.response.status} - ${JSON.stringify(
                  error.response.data
                )}`
              );

              if (error.response.status !== 404) {
                navigate("/error");
              }
            } else if (error.request) {
              // The request was made but no response was received
              navigate("/error");
              console.error("No response received from the server");
            } else {
              // Something happened in setting up the request that triggered an error
              navigate("/error");
              console.error(`Error during request setup: ${error.message}`);
            }
          } finally {
            setShowSpinner(false);
          }
        } else {
          console.error("Error: User not authenticated");
          navigate("/error");
        }
      } else {
        console.error("No userID cookie found");
        navigate("/error");
      }
    };

    fetchData();
  }, [setError, currentUser]);

  return (
    <div className="px-2 pt-2">
      <Banner image={bannerImage} height={"19rem"} />
      {showSpinner ? (
        <Container
          className="d-flex justify-content-center"
          style={{ marginBlock: "8rem" }}
        >
          <Spinner animation="border" role="status" variant="info">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        <>
          <div className="py-5" />
          <Container className="d-flex justify-content-center py-5">
            <p className="text-uppercase p-0 profile-title-1">Your</p>
            <span className="text-uppercase p-0 mx-2 profile-title-2">
              Account
            </span>
          </Container>
          <div className="profile-padding-div" />
          <Container>
            <Enquiry
              currentEnquiryType={CURRENT_ENQUIRY}
              modalShow={modalShow}
              setModalShow={setModalShow}
            />
            <ProfileTabs />
          </Container>
          <Container className="pt-5">
            <Row className="p-0 m-0">
              <Col className="p-0 m-0">
                <div>
                  <div className="profile-heading-text text-uppercase">
                    Enquiries
                  </div>
                </div>
              </Col>
              <Col className="account-enquiry-make-enquiry-button-col p-0 m-0">
                <Button
                  onClick={openModal}
                  className="account-enquiry-make-enquiry-button"
                >
                  MAKE ENQUIRY
                </Button>
              </Col>
            </Row>
            <div className="profile-line my-2" />
          </Container>
          <Container>
            <EnquiriesTable
              data={userEnquiries}
              updateUserEnquiry={updateUserEnquiry}
              entriesPerPage={5}
              loadingDetails={loadingDetails}
            />
          </Container>
        </>
      )}
    </div>
  );
}

export default AccountEnquiries;
