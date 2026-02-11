import React, { useMemo, useState } from "react";
import "./Home.css";

import logo from "../assets/images/logo.png";
import heroImg from "../assets/images/hero.png";
import bgImg from "../assets/images/bg.png"; // gardé (utile si tu veux plus tard), mais background géré via CSS

export default function Home() {
  const slides = useMemo(
    () => [
      {
        icon: "🍃",
        title: "Impact environnemental",
        text: "Visualisez en temps réel les émissions liées à vos sessions numériques et leur compensation.",
      },
      {
        icon: "🧠",
        title: "Apprentissage intelligent",
        text: "Des parcours générés par IA selon votre niveau, vos objectifs et votre rythme d’apprentissage.",
        featured: true,
      },
      {
        icon: "🌳",
        title: "Reforestation automatique",
        text: "Chaque session finance des projets de plantation d’arbres partenaires certifiés.",
      },
    ],
    []
  );

  const [activeDot, setActiveDot] = useState(1);

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav__container">
          <div className="nav__brand">
            <img src={logo} alt="EcoLearn AI" className="nav__logo" />
          </div>
        <nav className="nav__links">
  <a href="#accueil" className="nav__link">
    Accueil
  </a>
  <a href="#how" className="nav__link">
    Comment ça marche
  </a>
  <a href="#about" className="nav__link">
    À propos
  </a>
  <a href="#contact" className="nav__link">
    Contact
  </a>
</nav>


          <div className="nav__actions">
            <button className="btn btn--ghost">SE CONNECTER</button>
            <button className="btn btn--primary">INSCRIPTION</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main id="accueil" className="hero">
        <div className="hero__container">
          <div className="hero__top">
            <section className="hero__left">
              <h1 className="hero__title">
                Votre <span className="u-bold">savoir</span>, un impact{" "}
                <span className="u-bold">positif</span> sur la{" "}
                <span className="u-bold">planète</span>.
              </h1>

              <p className="hero__subtitle">
                Apprenez intelligemment, mesurez votre impact, et contribuez à
                un avenir plus vert grâce à l’IA.
              </p>

              <div className="hero__cta">
                <button className="btn btn--primary btn--lg">Commencer</button>
              </div>
            </section>

            <section className="hero__right">
              <img
                src={heroImg}
                alt="EcoLearn AI dashboard"
                className="hero__image"
                draggable="false"
              />
            </section>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="features" id="fonctionnalites">
        <div className="features__container">
          <div className="cards__grid">
            {slides.map((s) => (
              <article
                key={s.title}
                className={`card ${s.featured ? "card--featured" : ""}`}
              >
                <div className="card__icon">{s.icon}</div>
                <h3 className="card__title">{s.title}</h3>
                <p className="card__text">{s.text}</p>
              </article>
            ))}
          </div>

          
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <p>
            &copy; {new Date().getFullYear()} EcoLearn AI — Tous droits réservés.
          </p>
          <nav className="site-footer__links">
            <a href="#contact">Contact</a>
            <a href="#privacy">Confidentialité</a>
            <a href="#terms">Conditions</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
