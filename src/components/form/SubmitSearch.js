
import styles from './SubmitSearch.module.css';
import pesquisar from '../../img/pesquisa.png';

function SubmitSearch() {
  return (
    <div>
      <button className={styles.btn}>
        <img src={pesquisar} alt='MusiCode' placeholder='Procurar Música'/>
      </button>
    </div>
  );
}

export default SubmitSearch;