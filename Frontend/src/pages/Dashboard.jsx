import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/images/logo.png";
import CarbonChart from "../components/CarbonChart";

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

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "module") {
      const firstSub = modulesData[value]?.[0] || "";
      setForm((p) => ({ ...p, module: value, sousModule: firstSub }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };


  const [iaResult, setIaResult] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState("");
  const [carbonStats, setCarbonStats] = useState(null);
  const [carbonHistory, setCarbonHistory] = useState([]);
  const [parcoursId, setParcoursId] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "http://localhost:8000");

  const fetchStats = async () => {
    try {
      const [resStats, resHistory] = await Promise.all([
        fetch(`${API_URL}/api/carbon/stats`, { headers: { token } }),
        fetch(`${API_URL}/api/carbon/history?limit=7`, { headers: { token } })
      ]);

      if (resStats.ok) {
        const stats = await resStats.json();
        setCarbonStats(stats);
      }

      if (resHistory.ok) {
        const history = await resHistory.json();
        const chartData = history.reverse().map(h => ({
          date: new Date(h.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          value: h.co2_grammes
        }));
        setCarbonHistory(chartData);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des stats carbon", e);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIaLoading(true);
    setIaError("");
    setIaResult("");
    setParcoursId(null);

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${API_URL}/api/ia/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          module: form.module,
          sous_module: form.sousModule,
          niveau: form.niveau,
          description: form.description,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setIaError("⏰ Quota Gemini dépassé. Réessayez plus tard.");
        } else {
          setIaError(data.detail || "Erreur lors de la génération.");
        }
        return;
      }

      setIaResult(data.contenu);
      setParcoursId(data.parcours_id);

      // Refresh stats after successful generation
      fetchStats();

    } catch (err) {
      if (err.name === 'AbortError') {
        setIaError("⏰ Timeout après 60s. Réessayez.");
      } else {
        setIaError("Backend inaccessible.");
      }
    } finally {
      setIaLoading(false);
    }
  };

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav__container">
          <div className="nav__brand" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="EcoLearn AI" className="nav__logo" />
          </div>
          <nav className="nav__links">
            <button onClick={() => navigate("/dashboard")} className="nav__link">Générer</button>
            <button onClick={() => navigate("/history")} className="nav__linkBtn">Historique</button>
          </nav>
          <div className="nav__actions" style={{ position: "relative" }}>
            <button className="btn btn--ghost" style={{ borderRadius: '12px' }} onClick={() => setProfileOpen((p) => !p)}>👤</button>
            {profileOpen && (
              <div className="profileMenu">
                <button className="btn btn--ghost" onClick={() => navigate("/settings")}>⚙ Paramètres</button>
                <button className="btn btn--primary" onClick={logout}>Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="hero" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="hero__container" style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '28px', padding: '20px 24px', margin: '0 auto' }}>
          <div className="hero__top" style={{ gap: '30px' }}>
            {/* LEFT SIDE: TITLE + FORM */}
            <section className="hero__left" style={{ padding: '0' }}>
              <h1 className="hero__title" style={{ fontSize: '36px', marginBottom: '2px', letterSpacing: '-0.8px' }}>
                Générer un <span className="u-bold" style={{ color: '#013759' }}>parcours</span> intelligent
              </h1>
              <p className="hero__subtitle" style={{ marginBottom: '20px', fontSize: '14px', color: '#64748b' }}>
                Personnalisez votre apprentissage et suivez votre impact.
              </p>

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div style={inputContainerStyle}>
                    <label style={labelStyle}>Matière / Domaine</label>
                    <div style={boxStyle}>
                      <select name="module" value={form.module} onChange={onChange}>
                        {moduleKeys.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={inputContainerStyle}>
                    <label style={labelStyle}>Spécialité</label>
                    <div style={boxStyle}>
                      <select name="sousModule" value={form.sousModule} onChange={onChange}>
                        {(modulesData[form.module] || []).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={inputContainerStyle}>
                    <label style={labelStyle}>Niveau requis</label>
                    <div style={boxStyle}>
                      <select name="niveau" value={form.niveau} onChange={onChange}>
                        {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={inputContainerStyle}>
                  <label style={labelStyle}>Description détaillée</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Ex: Bases de l'IA générative..."
                    style={{ ...textareaStyle }}
                  />
                </div>

                <button type="submit" className="btn btn--primary" style={generateBtnStyle} disabled={iaLoading}>
                  {iaLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="loader" style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', margin: 0 }}></div>
                      <span>Génération...</span>
                    </div>
                  ) : "Lancer la génération"}
                </button>
              </form>

              {carbonHistory.length > 0 && (
                <div style={{ marginTop: '20px', background: 'white', padding: '16px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                  <CarbonChart data={carbonHistory} />
                </div>
              )}
            </section>

            {/* RIGHT SIDE: RESULT CARD */}
            <section className="hero__right">
              <div className="result-card" style={{ background: 'white', border: '1px solid #f1f5f9', width: '100%', borderRadius: '28px', padding: '24px', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '18px' }}>🤖 Votre Parcours</h3>
                  {iaResult && <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>Prêt</span>}
                </div>

                {iaLoading && (
                  <div className="loader-container" style={{ textAlign: 'center', padding: '50px 0', flex: 1 }}>
                    <div className="loader" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                    <p style={{ color: '#64748b', marginTop: '12px', fontSize: '14px' }}>Traitement en cours...</p>
                  </div>
                )}

                {iaError && <div className="error-msg" style={{ color: '#ef4444', background: '#fef2f2', padding: '14px', borderRadius: '12px', fontSize: '14px' }}>❌ {iaError}</div>}

                {iaResult ? (
                  <div className="result-content" style={{ flex: 1 }}>
                    <div className="markdown-txt" style={{ fontSize: '14px', maxHeight: '420px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#334155', paddingRight: '8px' }}>{iaResult}</div>
                  </div>
                ) : !iaLoading && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                    <p style={{ maxWidth: '240px', fontSize: '14px' }}>Préparez votre parcours d'apprentissage.</p>
                  </div>
                )}

                <div className="carbon-summary" style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <div className="stat-item" style={{ flex: 1 }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 'bold' }}>Total CO2 (kg)</span>
                    <b style={{ color: '#10b981', fontSize: '20px', marginTop: '2px', display: 'block' }}>{carbonStats ? (carbonStats.total_co2_kg.toFixed(3)) : "0.000"}</b>
                  </div>
                  <div className="stat-item" style={{ flex: 1 }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 'bold' }}>Arbres Équiv.</span>
                    <b style={{ color: '#10b981', fontSize: '20px', marginTop: '2px', display: 'block' }}>{carbonStats ? (carbonStats.total_equivalent_arbres.toFixed(4)) : "0.0000"}</b>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        .nav__link { background: none; border: none; color: #64748b; font-size: 14px; cursor: pointer; padding: 6px 14px; font-weight: 600; text-decoration: none; transition: 0.2s; }
        .nav__linkBtn { background: none; border: none; color: #64748b; font-size: 14px; cursor: pointer; padding: 6px 14px; font-weight: 600; transition: 0.2s; }
        .nav__linkBtn:hover, .nav__link:hover { color: #013759; }
        .loader { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top: 3px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .profileMenu { position: absolute; top: calc(100% + 6px); right: 0; background: white; border-radius: 14px; padding: 8px; box-shadow: 0 15px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 4px; z-index: 100; min-width: 170px; border: 1px solid #f1f5f9; }
        select { border: none; background: transparent; width: 100%; height: 100%; cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 500; color: #1e293b; outline: none; -webkit-appearance: none; }
        textarea:focus { border-color: #013759 !important; box-shadow: 0 0 0 3px rgba(1, 55, 89, 0.05); outline: none; }
        .markdown-txt::-webkit-scrollbar { width: 5px; }
        .markdown-txt::-webkit-scrollbar-track { background: transparent; }
        .markdown-txt::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#64748b',
  paddingLeft: '2px',
};

const boxStyle = {
  background: 'white',
  padding: '0 16px',
  borderRadius: '14px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #f1f5f9',
  transition: 'all 0.2s',
};

const generateBtnStyle = {
  height: '50px',
  fontSize: '15px',
  fontWeight: 'bold',
  borderRadius: '14px',
  background: '#013759',
  boxShadow: '0 8px 20px rgba(1, 55, 89, 0.15)',
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const textareaStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1px solid #f1f5f9',
  background: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  minHeight: '70px',
  fontSize: '14px',
  fontFamily: 'inherit',
  resize: 'none',
  transition: 'all 0.2s',
};
