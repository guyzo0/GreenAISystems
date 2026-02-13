import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ messages inline (comme Register)
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));

    // on efface les messages quand l'utilisateur retape
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validate = () => {
    const e = {};

    if (!form.email.trim()) e.email = "Email obligatoire.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide.";

    if (!form.password) e.password = "Mot de passe obligatoire.";
    else if (form.password.length < 3) e.password = "Minimum 3 caractères.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.detail || "Email ou mot de passe incorrect.");
        return;
      }

      // ✅ sauvegarde session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.utilisateur_id);
      localStorage.setItem("email", data.email);

      // ✅ message personnalisé + redirection
      setSuccessMessage(
        `✅ Bon retour ${data.email} ! Connexion réussie.
Redirection vers votre dashboard...`
      );

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage("Backend inaccessible. Vérifiez que l’API est lancée.");
    } finally {
      setLoading(false);
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

        {/* ✅ MESSAGE SUCCESS / ERROR inline */}
        {successMessage && <div className="success-inline">{successMessage}</div>}
        {errorMessage && <div className="error-inline">{errorMessage}</div>}

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
            {errors.password && <small className="error">{errors.password}</small>}
          </label>

          <button
            className="btnAuth btnAuth--primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
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
