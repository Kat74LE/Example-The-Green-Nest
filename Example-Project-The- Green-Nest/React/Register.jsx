import "../assets/css/pages/Register.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../forms/RegisterForm";
import { Formik } from "formik";
import * as Yup from "yup";
import { Container, Modal, Spinner } from "react-bootstrap";
import Banner from "../layouts/Banner";
import { handleDBRegistration } from "../utils/authenticationUtils";
import { resourceFolder, images } from "../config/resources";

function Register() {
  const bannerImage = `${resourceFolder.images}${images.loginPageBannerImage}`;

  const { register, sendEmailVerification, logout, setStoredUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);

  function closeModal() {
    setModalShow(false);
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required Email"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required Password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required Password"),
  });

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  async function handleFormSubmit(values, { setSubmitting, resetForm }) {
    let user;
    try {
      setLoading(true);
      setModalShow(true);
      const userCredential = await register(values.email, values.password);
      user = userCredential.user;
      const token = user && (await user.getIdToken());
      await handleDBRegistration(values, token);
      // Proceed to email verification
      await sendEmailVerification(user);
      setStoredUser(user);
      await logout();
      navigate("/verify-email");
    } catch (error) {
      navigate("/error");
      if (user) {
        await user.delete();
      }
    } finally {
      setSubmitting(false);
      setModalShow(false);
      setLoading(false);
      resetForm();
    }
  }

  return (
    <>
      <Container className="px-0 pt-2">
        <Banner image={bannerImage} />
        {loading && (
          <>
            <Modal
              show={modalShow}
              dialogClassName="modalStyle"
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              onHide={closeModal}
              backdrop="static"
              keyboard={false}
            >
              <div>
                <Modal.Body className="machineModalStyleBody">
                  <h4 className="mt-1 font-700 justify-content-center d-flex">
                    Please wait...
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
        )}
        <div className="py-5" />
        <Container className="d-flex justify-content-center">
          <div className="register-form-container d-flex justify-content-center align-items-center">
            <div className="register-inner-form-container px-5">
              <div className="py-4">
                <div className="d-flex register-form-heading font-500">
                  Sign Up
                </div>
                <div className="d-flex register-form-sub-heading font-500">
                  Please enter your details
                </div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                <RegisterForm />
              </Formik>
              <div className="py-2" />
            </div>
          </div>
        </Container>
        <Container className="py-5 my-5" />
      </Container>
    </>
  );
}

export default Register;
