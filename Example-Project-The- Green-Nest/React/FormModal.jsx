import "../assets/css/components/ModalStyle.css";
import "../assets/css/components/ArticleFormModal.css";

import { Modal, CloseButton, Spinner, Container } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { connections, endpoints } from "../config/connections";
import { useState } from "react";

const FormModal = ({
  modalstyleheader,
  modalstylebody,
  modalstyletitle,
  HeaderComponent,
  BodyComponent,
  headerProps,
  onHide,
  show,
  initialValues,
  validationSchema,
  loading,
}) => {
  const { currentUser, setError } = useAuth();
  const navigate = useNavigate();

  const [loadingData, setLoadingData] = useState(false);

  //Submit the Form
  async function handleSubmit(values) {
    try {
      setLoadingData(true);
      let endpoint = `${connections.server}${endpoints.enquiriesEnquire}`;
      let headers = { "Content-Type": "application/json" };

      if (currentUser) {
        const bearerToken = await currentUser.getIdToken();

        if (bearerToken) {
          endpoint = `${connections.server}${endpoints.enquiriesEnquireAuthenticated}`;
          headers = {
            "X-Priority": "high",
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          };
        }
      } else {
      }

      const response = await axios.post(endpoint, values, {
        headers: headers,
      });

      if (response.status >= 200 && response.status < 300) {
        navigate("/confirmation");
      } else {
        console.error("Server error:", response.status, response.data);
        setError("Something went wrong!");

        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      navigate("/error");
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <>
      {loadingData ? (
        <>
          <Modal
            show={show}
            dialogClassName="modalStyle"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
            backdrop="static"
            keyboard={false}
          >
            <div>
              <Modal.Body className={modalstylebody}>
                <h4 className="mt-1 font-700 justify-content-center d-flex">
                  Submitting...
                </h4>
                <Container
                  className="d-flex justify-content-center"
                  style={{ marginBlock: "2rem" }}
                >
                  <Spinner animation="border" role="status" variant="info">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Container>
              </Modal.Body>
            </div>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            show={show}
            dialogClassName="modalStyle"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              key={loading}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              <div>
                <Modal.Header className={modalstyleheader}>
                  <CloseButton
                    onClick={onHide}
                    className="modalCloseButton"
                    variant="white"
                  ></CloseButton>
                  <Modal.Title
                    id="contained-modal-title-vcenter"
                    className={modalstyletitle}
                  >
                    <HeaderComponent {...headerProps} />
                  </Modal.Title>
                </Modal.Header>
                <div className="article-form-header-div">
                  <h4 className="article-form-header font-600">
                    Please fill in your enquiry information below
                  </h4>
                </div>
                <Modal.Body className={modalstylebody}>
                  <BodyComponent handleSubmit={handleSubmit} />
                </Modal.Body>
              </div>
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
};

export default FormModal;
