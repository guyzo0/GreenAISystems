import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import logo from "../assets/images/logo.png";

export default function Settings() {
  const navigate = useNavigate();

  // ✅ API URL robuste
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "http://localhost:8000"); // change si besoin

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    date_naissance: "",
    password: "",
    password_confirm: "",
  });

  // ✅ Si pas connecté => login
  useEffect(() => {
    if (!token || !userId) navigate("/login");
  }, [token, userId, navigate]);

  // ✅ Charger les infos utilisateur
  useEffect(() => {
    if (!token || !userId) return;

    const loadUser = async () => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: { token }, // ✅ IMPORTANT: backend lit header "token"
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.detail || "Impossible de charger vos informations.");
          return;
        }

        setForm((p) => ({
          ...p,
          prenom: data.prenom ?? "",
          nom: data.nom ?? "",
          email: data.email ?? "",
          date_naissance: data.date_naissance ?? "",
        }));
      } catch (e) {
        setErrorMessage(
          `Backend inaccessible. Vérifie que l’API tourne sur ${API_URL}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [API_URL, token, userId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // ✅ payload conforme à tes schemas backend
      const payload = {
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        date_naissance: form.date_naissance || null,
      };

      // ✅ n'envoyer password que si rempli
      if (form.password) {
        if (!form.password_confirm) {
          setErrorMessage("Veuillez confirmer le mot de passe.");
          setLoading(false);
          return;
        }
        payload.password = form.password;
        payload.password_confirm = form.password_confirm;
      }

      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token, // ✅ IMPORTANT
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.detail || "Échec de mise à jour.");
        return;
      }

      setSuccessMessage(
        `✅ Parfait ${data.prenom || form.prenom} ! Vos informations ont été mises à jour avec succès.`
      );

      // ✅ reset password fields après succès
      setForm((p) => ({ ...p, password: "", password_confirm: "" }));
    } catch (err) {
      setErrorMessage(
        `Backend inaccessible. Vérifie que l’API tourne sur ${API_URL}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ évite de render si pas connecté (anti-flash)
  if (!token || !userId) return null;

  return (
    <div className="settings">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav__container">
          <div
            className="nav__brand"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <img src={logo} alt="EcoLearn AI" className="nav__logo" />
          </div>

          <nav className="nav__links">
            <button className="nav__linkBtn" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className="nav__linkBtn nav__linkBtn--active">
              Paramètres
            </button>
          </nav>

          <div className="nav__actions" style={{ position: "relative" }}>
            <button className="btn btn--ghost" onClick={() => setProfileOpen((p) => !p)}>
              👤 Profil
            </button>

            {profileOpen && (
              <div className="profileMenu" onMouseLeave={() => setProfileOpen(false)}>
                <button className="btn btn--ghost" onClick={() => setProfileOpen(false)}>
                  ⚙ Paramètres
                </button>
                <button className="btn btn--primary" onClick={logout}>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="settings__main">
        <div className="settings__card">
          <h1 className="settings__title">Vos paramètres</h1>
          <p className="settings__subtitle">
            Modifiez vos informations personnelles. Le mot de passe est optionnel.
          </p>

          {loading && <div className="msg msg--info">Chargement...</div>}
          {errorMessage && <div className="msg msg--error">{errorMessage}</div>}
          {successMessage && <div className="msg msg--success">{successMessage}</div>}

          <form className="settings__form" onSubmit={onSubmit}>
            <label className="field">
              <span>Prénom</span>
              <input name="prenom" value={form.prenom} onChange={onChange} />
            </label>

            <label className="field">
              <span>Nom</span>
              <input name="nom" value={form.nom} onChange={onChange} />
            </label>

            <label className="field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={onChange} />
            </label>

            <label className="field">
              <span>Date de naissance</span>
              <input
                type="date"
                name="date_naissance"
                value={form.date_naissance || ""}
                onChange={onChange}
              />
            </label>

            <hr className="sep" />

            <h3 className="settings__sectionTitle">Changer le mot de passe (optionnel)</h3>

            <label className="field">
              <span>Nouveau mot de passe</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Laisser vide si inchangé"
              />
            </label>

            <label className="field">
              <span>Confirmer le mot de passe</span>
              <input
                type="password"
                name="password_confirm"
                value={form.password_confirm}
                onChange={onChange}
                placeholder="Obligatoire si mot de passe rempli"
              />
            </label>

            <div className="settings__actions">
              <button className="btnSave" type="submit" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>

              <button type="button" className="btnBack" onClick={() => navigate("/dashboard")}>
                Retour Dashboard
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
