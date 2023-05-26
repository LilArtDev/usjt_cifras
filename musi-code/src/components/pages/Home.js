import { Link } from "react-router-dom";

import ProjectForm from "../project/ProjectForm";
import styles from "./Home.module.css";
import fundo from "../../img/fundo.jpg";

function  Home({ onAuthentication }) {
  return (
    <>
      <div className={styles.code}>
        <section className={`${styles.hello}`}>
          <h1>
            Bem-vindo ao <br /> Musi<span>Code</span>
          </h1>

          <p>Acesse sua conta</p>
          <ProjectForm btnText="Entrar" onAuthentication={onAuthentication} />
          <h5>Esqueci minha senha</h5>
          <h3>
            Não tem uma conta?
            <Link to="Login">
              <span>Cadastre-se</span>
            </Link>
          </h3>
        </section>
      </div>
      <img
        src={fundo}
        alt="MusiCode"
        placeholder="Home"
        className={styles.background_image}
      />
    </>
  );
}

export default Home;