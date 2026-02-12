import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/images/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    date_naissance: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};

    if (!form.prenom.trim()) e.prenom = "Prénom obligatoire.";
    if (!form.nom.trim()) e.nom = "Nom obligatoire.";

    if (!form.date_naissance) e.date_naissance = "Date de naissance obligatoire.";

    if (!form.email.trim()) e.email = "Email obligatoire.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide.";

    if (!form.password) e.password = "Mot de passe obligatoire.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";

    if (!form.confirmPassword) e.confirmPassword = "Confirmation obligatoire.";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Les mots de passe ne correspondent pas.";

    if (!form.agree) e.agree = "Vous devez accepter les conditions.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
  ev.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const res = await fetch(`${API_URL}/api/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: form.prenom,
        nom: form.nom,
        date_naissance: form.date_naissance,
        email: form.email,
        password: form.password,
        password_confirm: form.confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Erreur d’inscription");
      return;
    }

    setSuccessMessage(
      `🎉 Bienvenue ${form.prenom} ! Votre compte EcoLearn AI est prêt.
Redirection vers la page de connexion...`
    );

    setTimeout(() => navigate("/login"), 2500);

  } catch (err) {
    console.error(err);
    alert("Backend inaccessible.");
  } finally {
    setLoading(false);
  }
};


  const closePopup = () => {
    setSuccessMessage("");
    if (redirectTimer.current) clearTimeout(redirectTimer.current);
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <img src={logo} alt="EcoLearn AI" className="auth__logo" />
          <div>
            <h1 className="auth__title">Inscription</h1>
            <p className="auth__subtitle">
              Créez votre compte EcoLearn AI en quelques secondes.
            </p>
          </div>
        </div>

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          {/* PRENOM */}
          <label className="field">
            <span>Prénom</span>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={onChange}
              placeholder="Prénom"
              autoComplete="given-name"
            />
            {errors.prenom && <small className="error">{errors.prenom}</small>}
          </label>

          {/* NOM */}
          <label className="field">
            <span>Nom</span>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={onChange}
              placeholder="Nom"
              autoComplete="family-name"
            />
            {errors.nom && <small className="error">{errors.nom}</small>}
          </label>

          {/* DATE NAISSANCE */}
          <label className="field">
            <span>Date de naissance</span>
            <input
              type="date"
              name="date_naissance"
              value={form.date_naissance}
              onChange={onChange}
              autoComplete="bday"
            />
            {errors.date_naissance && (
              <small className="error">{errors.date_naissance}</small>
            )}
          </label>

          {/* EMAIL */}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="ex: user@ecolearn.ai"
              autoComplete="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          {/* PASSWORD */}
          <label className="field">
            <span>Mot de passe</span>
            <div className="pwd">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="new-password"
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

          {/* CONFIRM PASSWORD */}
          <label className="field">
            <span>Confirmer le mot de passe</span>
            <input
              type={showPwd ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <small className="error">{errors.confirmPassword}</small>
            )}
          </label>

          {/* TERMS */}
          <label className="check check--terms">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={onChange}
            />
            <span>
              J’accepte les{" "}
              <a className="auth__link" href="#terms">
                conditions
              </a>{" "}
              et la{" "}
              <a className="auth__link" href="#privacy">
                confidentialité
              </a>
              .
            </span>
          </label>
          {errors.agree && <small className="error">{errors.agree}</small>}

          <button
            className="btnAuth btnAuth--primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <p className="auth__hint">
            Déjà un compte ?{" "}
            <Link className="auth__link" to="/login">
              Se connecter
            </Link>
          </p>

          <Link className="btnAuth btnAuth--ghost" to="/">
            Retour à l’accueil
          </Link>
        </form>
        {successMessage && (
  <div className="success-inline">
    {successMessage}
  </div>
)}

      </div>

      {/* ✅ SUCCESS POPUP */}
      {successMessage && (
        <div className="success-popup" onClick={closePopup}>
          <div
            className="success-popup__card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Compte créé ✅</h3>
            <p style={{ whiteSpace: "pre-line" }}>{successMessage}</p>

            <div className="success-popup__actions">
              <button
                type="button"
                className="btnAuth btnAuth--primary"
                onClick={() => navigate("/login")}
              >
                Se connecter maintenant
              </button>

              <button
                type="button"
                className="btnAuth btnAuth--ghost"
                onClick={closePopup}
              >
                Fermer
              </button>
            </div>

            <small className="success-popup__hint">
              Redirection automatique dans quelques secondes...
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
