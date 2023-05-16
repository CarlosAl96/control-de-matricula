import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Messages } from "primereact/messages";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../../firebase";

const Login = () => {
  const msgs = React.useRef(null);
  const navigate = useNavigate();
  const [authData, setAuthData] = React.useState({ email: "", password: "" });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, authData.email, authData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        getDataUser(user.uid, user.email);
      })
      .catch((error) => {

        msgs.current.show([
          {
            severity: "error",
            summary: "Error: datos incorrectos",
            sticky: true,
            closable: false,
          },
        ]);
      });
  };

  const getDataUser = async (id, email) => {
    const db = getFirestore();
    const idRef = collection(db, "dataUser");
    const q = query(idRef, where("id_user", "==", id));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      dispatch(
        setUser({ id: doc.id, email: email, id_user: id, ...doc.data() })
      );
    });

    navigate("/admin/dashboard");
  };

  return (
    <div className="container-page">
      <Card className="pr-3 pl-3 mt-7">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-column w-full">
            <h1>Inicio de sesión</h1>

            <InputText
              className="mt-5"
              placeholder="Correo"
              type="email"
              name="email"
              value={authData.email}
              onChange={handleChange}
            />
            <Password
              className="mt-5 w-full"
              placeholder="Contraseña"
              type="password"
              name="password"
              value={authData.password}
              onChange={handleChange}
              feedback={false}
              toggleMask
            />
          </div>
          <div className="flex flex-column mt-5">
            <div>
              <span className="mr-2">¿Has olvidado tu contraseña?</span>
              <a href="/reset-password">Click Aquí!</a>
            </div>

            <Button className="mt-5" type="submit">
              Iniciar sesión
            </Button>

            <Messages className="mt-3" ref={msgs} />

            <div className="mt-5">
              <span className="mr-2">¿Aún no te has registrado?</span>
              <a href="/register">Click Aquí!</a>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
