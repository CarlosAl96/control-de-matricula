import React from "react";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Messages } from "primereact/messages";
import { ConfirmDialog } from "primereact/confirmdialog";

import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../../firebase";

const Register = () => {
  const msgs = React.useRef(null);
  const [code, setCode] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const navigate = useNavigate();

  const genders = ["Femenino", "Masculino", "No binario"];
  const jobTypes = ["Administrativo", "Docente"];

  const querydb = getFirestore();

  const onHide = () => {
    setVisible(false);
  };

  const showConfirm = () => {
    setVisible(true);
  };

  const confirm = () => {
    onHide();
    navigate("/");
  };

  const footer = (
    <div>
      <Button label="OK" className="p-button-text" onClick={confirm} />
    </div>
  );

  React.useEffect(() => {
    if (!code) {
      getCode();
    }
    console.log(code);
  }, [code]);

  const getCode = async () => {
    const queryDocs = collection(querydb, "codes");
    const data = await getDocs(queryDocs);

    data.forEach((doc) => {
      setCode(doc.data().code);
    });
  };

  const saveUserFirebase = (values) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        saveDataUser(values, user.uid);
      })
      .catch((error) => {
        msgs.current.show([
          {
            severity: "error",
            summary: "Error: ya existe una cuenta con este correo",
            sticky: false,
            closable: false,
          },
        ]);

        // ..
      });
  };

  const saveDataUser = async (values, id) => {
    delete values.email;
    delete values.password;
    delete values.password_repeat;
    delete values.code;

    const date = new Date(values.birthdate);

    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    delete values.birthdate;

    await addDoc(collection(querydb, "dataUser"), {
      ...values,
      birthdate: formattedDate,
      id_user: id,
      role: values.job_type == "Administrativo" ? "admin" : "teacher",
      enabled: false,
    });

    showConfirm();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      last_name: "",
      email: "",
      academic_level: "",
      address: "",
      birthdate: "",
      gender: "",
      job_type: "",
      phone: "",
      number_id: "",
      password: "",
      password_repeat: "",
      code: "",
    },
    onSubmit: (values) => {
      saveUserFirebase(values);
      formik.resetForm();
    },
    validate: (values) => {
      let errors = {};

      if (!values.name) {
        errors.name = "Campo requerido";
      }
      if (!values.last_name) {
        errors.last_name = "Campo requerido";
      }
      if (!values.email) {
        errors.email = "Campo requerido";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Correo no válido";
      }
      if (!values.academic_level) {
        errors.academic_level = "Campo requerido";
      }
      if (!values.address) {
        errors.address = "Campo requerido";
      }
      if (!values.birthdate) {
        errors.birthdate = "Campo requerido";
      }
      if (!values.gender) {
        errors.gender = "Campo requerido";
      }
      if (!values.job_type) {
        errors.job_type = "Campo requerido";
      }
      if (!values.phone) {
        errors.phone = "Campo requerido";
      }
      if (!values.number_id) {
        errors.number_id = "Campo requerido";
      }
      if (!values.password) {
        errors.password = "Campo requerido";
      } else if (!/^\d{6}$/i.test(values.password)) {
        errors.password = "Debe ser de 6 dígitos o más";
      }
      if (!values.password_repeat) {
        errors.password_repeat = "Campo requerido";
      }
      if (!values.code) {
        errors.code = "Campo requerido";
      }

      if (values.password !== values.password_repeat) {
        errors.password_repeat = "La contraseña no coincide";
      }

      if (values.code !== code) {
        errors.code = "Código de acceso inválido";
      }

      return errors;
    },
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="container-page">
      <ConfirmDialog
        visible={visible}
        onHide={onHide}
        message="Su cuenta se ha registrado de manera exitosa"
        icon="pi pi-check"
        closable={false}
        footer={footer}
      />
      <Card className="pr-3 pl-3">
        <form onSubmit={formik.handleSubmit}>
          <h1>Registrarse</h1>

          <div className="form-register">
            <div className="w-full mr-4">
              <h2>Datos personales</h2>
              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("name"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="name">Nombre</label>
              </span>
              {getFormErrorMessage("name")}

              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("last_name"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="last_name">Apellido</label>
              </span>
              {getFormErrorMessage("last_name")}

              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="email"
                  name="email"
                  type="text"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("email"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="email">Correo electrónico</label>
              </span>
              {getFormErrorMessage("email")}

              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="number_id"
                  name="number_id"
                  type="text"
                  value={formik.values.number_id}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("number_id"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="number_id">Cédula</label>
              </span>
              {getFormErrorMessage("number_id")}

              <span className="p-float-label mt-3 w-full">
                <InputMask
                  id="phone"
                  mask="+58 999 9999999"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("phone"),
                    "w-full": true,
                  })}
                ></InputMask>
                <label htmlFor="phone">Teléfono</label>
              </span>
              {getFormErrorMessage("phone")}

              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="address"
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("address"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="address">Dirección</label>
              </span>
              {getFormErrorMessage("address")}

              <span className="p-float-label mt-3 w-full">
                <Dropdown
                  id="gender"
                  options={genders}
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("gender"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="gender">Género</label>
              </span>
              {getFormErrorMessage("gender")}

              <span className="p-float-label mt-3 w-full">
                <Calendar
                  id="birthdate"
                  name="birthdate"
                  value={formik.values.birthdate}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("birthdate"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="birthdate">Fecha de nacimiento</label>
              </span>
              {getFormErrorMessage("birthdate")}
            </div>

            <div className="w-full ml-4">
              <h2>Datos laborales</h2>

              <span className="p-float-label mt-3 w-full">
                <Dropdown
                  id="job_type"
                  options={jobTypes}
                  name="job_type"
                  value={formik.values.job_type}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("job_type"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="job_type">Tipo de cargo</label>
              </span>
              {getFormErrorMessage("job_type")}

              <span className="p-float-label mt-3 w-full">
                <InputText
                  id="academic_level"
                  type="text"
                  name="academic_level"
                  value={formik.values.academic_level}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("academic_level"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="academic_level">Nivel académico</label>
              </span>
              {getFormErrorMessage("academic_level")}

              <h2 className="mt-5">Código de acceso</h2>

              <span className="p-float-label mt-3 w-full">
                <Password
                  id="code"
                  type="password"
                  feedback={false}
                  toggleMask
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("code"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="code">Código</label>
              </span>
              {getFormErrorMessage("code")}

              <p>
                Si no posee un código de acceso, comuníquese con el
                administrador del sistema.
              </p>

              <h2 className="mt-5">Contraseña</h2>

              <span className="p-float-label mt-3 w-full">
                <Password
                  id="password"
                  type="password"
                  feedback={false}
                  toggleMask
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("password"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="password">Contraseña</label>
              </span>
              {getFormErrorMessage("password")}

              <span className="p-float-label mt-3 w-full">
                <Password
                  id="password_repeat"
                  type="password"
                  feedback={false}
                  toggleMask
                  name="password_repeat"
                  value={formik.values.password_repeat}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("password_repeat"),
                    "w-full": true,
                  })}
                />
                <label htmlFor="password_repeat">Repita la contraseña</label>
              </span>
              {getFormErrorMessage("password_repeat")}

              <Messages className="mt-3" ref={msgs} />
            </div>
          </div>

          <div className="flex flex-column mt-5">
            <Button type="submit" className="mt-5">
              Crear cuenta
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
