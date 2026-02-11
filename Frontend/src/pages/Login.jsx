import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/images/logo.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email obligatoire.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide.";

    if (!form.password) e.password = "Mot de passe obligatoire.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ FETCH LOGIN
  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur de connexion");
        return;
      }

      console.log("TOKEN:", data.access_token);

      // stocker token
      localStorage.setItem("token", data.access_token);

      // redirect (à adapter si tu as une autre route)
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Backend inaccessible.");
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <img src={logo} alt="EcoLearn AI" className="auth__logo" />
          <div>
            <h1 className="auth__title">Se connecter</h1>
            <p className="auth__subtitle">Accédez à votre espace EcoLearn AI.</p>
          </div>
        </div>

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="ex: user@ecolearn.ai"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <div className="pwd">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="pwd__toggle"
                onClick={() => setShowPwd((p) => !p)}
              >
                {showPwd ? "Masquer" : "Afficher"}
              </button>
            </div>
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </label>

          <div className="auth__row">
            <label className="check">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>

            <a className="auth__link" href="#">
              Mot de passe oublié ?
            </a>
          </div>

          <button className="btnAuth btnAuth--primary" type="submit">
            Se connecter
          </button>

          <p className="auth__hint">
            Pas de compte ?{" "}
            <Link className="auth__link" to="/register">
              Inscription
            </Link>
          </p>

          <Link className="btnAuth btnAuth--ghost" to="/">
            Retour à l’accueil
          </Link>
        </form>
      </div>
    </div>
  );
}
