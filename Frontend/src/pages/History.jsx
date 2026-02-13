import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/images/logo.png";

export default function History() {
    const navigate = useNavigate();
    const [parcours, setParcours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchParcours = async () => {
            try {
                const res = await fetch(`${API_URL}/api/parcours/`, {
                    headers: { token },
                });
                if (res.ok) {
                    const data = await res.json();
                    setParcours(data);
                } else {
                    setError("Erreur lors du chargement de l'historique.");
                }
            } catch (err) {
                setError("Impossible de contacter le serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchParcours();
    }, [token, navigate, API_URL]);

    const deleteParcours = async (id) => {
        if (!window.confirm("Supprimer ce parcours ?")) return;
        try {
            const res = await fetch(`${API_URL}/api/parcours/${id}`, {
                method: "DELETE",
                headers: { token },
            });
            if (res.ok) {
                setParcours(parcours.filter((p) => p.id !== id));
                if (selected?.id === id) setSelected(null);
            }
        } catch (e) {
            alert("Erreur lors de la suppression.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="home">
            <header className="nav">
                <div className="nav__container">
                    <div className="nav__brand" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="EcoLearn AI" className="nav__logo" />
                    </div>
                    <nav className="nav__links">
                        <button onClick={() => navigate("/dashboard")} className="nav__linkBtn">Dashboard</button>
                        <button onClick={() => navigate("/history")} className="nav__link">Historique</button>
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
                <div className="hero__container" style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '28px', padding: '24px', margin: '0 auto', maxWidth: '1200px', width: '95%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: '70vh' }}>

                        {/* Sidebar - List */}
                        <aside className="history-list" style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#013759', fontWeight: '800' }}>📚 Mes Parcours</h2>

                            {loading && (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <div className="loader" style={{ width: '30px', height: '30px' }}></div>
                                </div>
                            )}

                            {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
                            {!loading && parcours.length === 0 && <p style={{ color: '#64748b', fontSize: '14px' }}>Aucun parcours généré.</p>}

                            <div className="history-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
                                {parcours.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelected(p)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            background: selected?.id === p.id ? '#013759' : 'white',
                                            color: selected?.id === p.id ? 'white' : '#1e293b',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{p.titre.split(' - ')[0]}</h4>
                                        <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.8 }}>
                                            {new Date(p.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Content - Detail */}
                        <section className="history-detail" style={{ background: 'white', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                            {selected ? (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                                        <div>
                                            <h1 style={{ fontSize: '20px', margin: 0, color: '#013759', fontWeight: '800' }}>{selected.titre}</h1>
                                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Généré le {new Date(selected.date_creation).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteParcours(selected.id)}
                                            className="btn"
                                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold' }}
                                        >
                                            🗑 Supprimer
                                        </button>
                                    </div>
                                    <div className="markdown-txt" style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#334155', fontSize: '14px', paddingRight: '10px' }}>
                                        {selected.contenu_genere_ia}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', textAlign: 'center' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📖</div>
                                    <p style={{ maxWidth: '280px', fontSize: '15px' }}>Sélectionnez un parcours dans la liste pour voir les détails de votre apprentissage.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <style>{`
                .nav__linkBtn { background: none; border: none; color: #64748b; font-size: 14px; cursor: pointer; padding: 6px 14px; font-weight: 600; transition: 0.2s; }
                .nav__link { background: none; border: none; color: #013759; font-size: 14px; cursor: pointer; padding: 6px 14px; font-weight: 600; text-decoration: none; }
                .nav__linkBtn:hover { color: #013759; }
                .loader { border: 3px solid #f1f5f9; border-top: 3px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .history-scroll::-webkit-scrollbar, .markdown-txt::-webkit-scrollbar { width: 5px; }
                .history-scroll::-webkit-scrollbar-track, .markdown-txt::-webkit-scrollbar-track { background: transparent; }
                .history-scroll::-webkit-scrollbar-thumb, .markdown-txt::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
