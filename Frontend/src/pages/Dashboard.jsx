import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/images/logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ modules -> sous-modules
  const modulesData = useMemo(
    () => ({
      Informatique: [
        "Intelligence Artificielle",
        "Machine Learning",
        "Réseaux",
        "Cybersécurité",
        "Développement Web",
        "Développement Mobile",
        "Cloud Computing",
        "Data Science",
        "Bases de Données",
      ],
      Mathématiques: [
        "Algèbre",
        "Analyse",
        "Probabilités & Statistiques",
        "Calcul différentiel",
        "Géométrie",
        "Optimisation",
      ],
      Physique: [
        "Mécanique",
        "Électricité",
        "Magnétisme",
        "Optique",
        "Thermodynamique",
        "Physique Quantique",
      ],
      Chimie: [
        "Chimie Organique",
        "Chimie Inorganique",
        "Chimie Analytique",
        "Biochimie",
        "Cinétique Chimique",
      ],
      SVT: ["Génétique", "Biologie Cellulaire", "Écologie", "Géologie", "Physiologie"],
      Géographie: [
        "Cartographie",
        "Climatologie",
        "Géopolitique",
        "Hydrologie",
        "Aménagement du Territoire",
      ],
      Histoire: [
        "Histoire Antique",
        "Histoire Médiévale",
        "Histoire Moderne",
        "Relations Internationales",
        "Histoire Contemporaine",
      ],
      Économie: [
        "Microéconomie",
        "Macroéconomie",
        "Économie Internationale",
        "Finance",
        "Économie du Développement",
      ],
      Management: [
        "Gestion des Ressources Humaines",
        "Marketing",
        "Stratégie",
        "Entrepreneuriat",
        "Management de Projet",
      ],
      Langues: ["Anglais", "Français", "Espagnol", "Allemand", "Arabe"],
    }),
    []
  );

  const niveaux = ["Débutant", "Moyen", "Avancé"];

  const moduleKeys = Object.keys(modulesData);

  const [form, setForm] = useState({
    module: moduleKeys[0],
    sousModule: modulesData[moduleKeys[0]][0],
    niveau: "Débutant",
    description: "",
  });

  const sousModules = modulesData[form.module] || [];

  const onChange = (e) => {
    const { name, value } = e.target;

    // ✅ si module change => sous-module doit se reset
    if (name === "module") {
      const firstSub = modulesData[value]?.[0] || "";
      setForm((p) => ({ ...p, module: value, sousModule: firstSub }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    alert(
      `Module: ${form.module}\nSous-module: ${form.sousModule}\nNiveau: ${form.niveau}\nDescription: ${form.description}`
    );
  };

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav__container">
          <div className="nav__brand">
            <img src={logo} alt="EcoLearn AI" className="nav__logo" />
          </div>

          <nav className="nav__links">
            <a href="#generate" className="nav__link">
              Générer
            </a>
            <a href="#history" className="nav__link">
              Historique
            </a>
            <a href="#impact" className="nav__link">
              Impact
            </a>
          </nav>

          <div className="nav__actions" style={{ position: "relative" }}>
            <button
              className="btn btn--ghost"
              onClick={() => setProfileOpen((p) => !p)}
            >
              👤
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  right: 0,
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: "14px",
                  boxShadow: "0 18px 45px rgba(1,55,89,0.18)",
                  border: "1px solid rgba(15,23,42,0.10)",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minWidth: "170px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <button className="btn btn--ghost" onClick={() => navigate("/settings")}>
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

      {/* MAIN */}
      <main className="hero" id="generate">
        <div className="hero__container">
          <div className="hero__top">
            {/* LEFT */}
            <section className="hero__left">
              <h1 className="hero__title">
                Générer un <span className="u-bold">parcours</span> intelligent
              </h1>

              <p className="hero__subtitle">
                Choisissez votre module, la spécialité, votre niveau, puis décrivez ce que vous
                voulez apprendre.
              </p>

              <form
                onSubmit={onSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginTop: "20px",
                  maxWidth: "520px",
                }}
              >
                {/* MODULE */}
                <select
                  name="module"
                  value={form.module}
                  onChange={onChange}
                  className="btn"
                  style={{ padding: "12px", textAlign: "left" }}
                >
                  {moduleKeys.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* SOUS-MODULE */}
                <select
                  name="sousModule"
                  value={form.sousModule}
                  onChange={onChange}
                  className="btn"
                  style={{ padding: "12px", textAlign: "left" }}
                >
                  {sousModules.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* NIVEAU */}
                <select
                  name="niveau"
                  value={form.niveau}
                  onChange={onChange}
                  className="btn"
                  style={{ padding: "12px", textAlign: "left" }}
                >
                  {niveaux.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                {/* DESCRIPTION */}
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Décrivez précisément ce que vous voulez (chapitre, exercices, résumé, cours, QCM...)"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(15,23,42,0.12)",
                    minHeight: "140px",
                    outline: "none",
                    fontSize: "14px",
                    color: "#0f172a",
                    background: "rgba(255,255,255,0.85)",
                  }}
                />

                <button type="submit" className="btn btn--primary btn--lg">
                  Générer
                </button>
              </form>
            </section>

            {/* RIGHT */}
            <section className="hero__right">
              <div
                style={{
                  background: "rgba(255,255,255,0.72)",
                  padding: "26px",
                  borderRadius: "20px",
                  boxShadow: "0 18px 45px rgba(1, 55, 89, 0.12)",
                  maxWidth: "430px",
                  textAlign: "left",
                  border: "1px solid rgba(255,255,255,0.50)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Résultat IA</h3>
                <p style={{ fontSize: "14px", color: "#6b7785", lineHeight: 1.6 }}>
                  Ici tu affiches la réponse générée par ton backend IA (plus tard).
                </p>

                <div style={{ marginTop: "14px", fontSize: "13px", color: "#334155" }}>
                  <div><b>Module:</b> {form.module}</div>
                  <div><b>Spécialité:</b> {form.sousModule}</div>
                  <div><b>Niveau:</b> {form.niveau}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <p>&copy; {new Date().getFullYear()} EcoLearn AI — Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
