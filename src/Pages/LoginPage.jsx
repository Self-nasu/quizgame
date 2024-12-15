import React, { useState } from "react";
import "./Login.css";
import QuizAppImg from "./../assets/QuizApp.png";
import {
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";
import db from "./../firebaseConfig";
import { data, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginSingUp = async () => {
        if (email == "MCA" & password == "MCA") {
            navigate("/quiz")
            return true
        }

        if (email.endsWith("@spsu.ac.in") == true & password != '') {
            const docID = email;
            const docRef = doc(db, "users", docID);
            const docsnap = await getDoc(docRef);

            if (docsnap.exists()) {
                const userData = docsnap.data();

                if (userData.password == password) {
                    navigate("/quiz");
                } else {
                    alert("Worng password.");
                }
            } else {
                const userData = {
                    email: docID,
                    password: password,
                };
                await setDoc(docRef, userData);
                console.log("User Created.");
                loginSingUp();
            }
        } else {
            alert("Worng Input Email");
        }
    };

    return (
        <>
            <div
                id="main-login"
                className="container d-flex justify-content-center align-items-center"
            >
                <div className="container bg-light w-25 p-4 justify-content-center align-items-center rounded-3 shadow-lg">
                    <div className="d-flex justify-content-center mb-3">
                        <img id="appimg" src={QuizAppImg} />
                    </div>
                    <input
                        type="email"
                        className="form-control my-2"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <input
                        type="password"
                        className="form-control my-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <button
                        type="submit"
                        onClick={loginSingUp}
                        className="btn btn-primary my-2 w-100"
                    >
                        Login / SignUp
                    </button>
                    <div className="d-flex justify-content-center m-0 mt-1 text-center">
                        <p className="text-secondary m-0">Only SPSU mail allowed but type "MCA" and "MCA" for hacking.....</p>
                    </div>
                </div>
            </div>
        </>
    );
}
