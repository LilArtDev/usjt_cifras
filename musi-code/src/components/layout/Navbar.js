import React from "react";
import { Link } from "react-router-dom";

import Container from "./Container";

import styles from "./Navbar.module.css";
import logo from "../../img/logo.png";
import home from "../../img/home.png";
import adicionar from "../../img/adicionar.png";
import musica from "../../img/musica.png";
import pesquisar from "../../img/pesquisa.png";
import sair from "../../img/sair.png";

function Navbar({ onLogout, authenticated }) {
  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img src={logo} alt="MusiCode" className={styles.logo} />
      </Link>
      <div className={styles.options}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">
              <img src={home} alt="MusiCode" placeholder="Home" />
            </Link>
          </li>
          {authenticated && (
            <>
              <li className={styles.item}>
                <Link to="/AddMusica">
                  <img
                    src={adicionar}
                    alt="MusiCode"
                    placeholder="Adicionar Música"
                  />
                </Link>
              </li>
              <li className={styles.item}>
                <Link to="/Search">
                  <img
                    src={pesquisar}
                    alt="MusiCode"
                    placeholder="Procurar Música"
                  />
                </Link>
              </li>
              <li className={styles.item}>
                <Link to="/MySongs">
                  <img
                    src={musica}
                    alt="MusiCode"
                    placeholder="Minhas Músicas"
                  />
                </Link>
              </li>
              <li className={styles.item}>
                <Link to="/" onClick={onLogout}>
                  <img src={sair} alt="MusiCode" placeholder="Sair" />
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
