import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/images/logo.png";

export default function Register() {
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

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          date_naissance: form.date_naissance, // format YYYY-MM-DD
          email: form.email,
          password: form.password, // backend le hash
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur d’inscription");
        return;
      }

      // Si le backend renvoie directement un token
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";
        return;
      }

      // Sinon => on redirige vers login
      alert("Inscription réussie. Vous pouvez vous connecter.");
      window.location.href = "/login";
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
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
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

          <button className="btnAuth btnAuth--primary" type="submit">
            Créer mon compte
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
      </div>
    </div>
  );
}
