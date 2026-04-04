import styles from "./Display.module.css";

const Display = ({ currentVal, expression }) => {
  return (
    <div className={styles.displayContainer}>
      <div className={styles.expression}>{expression}</div>
      <input 
        type="text" 
        className={styles.display} 
        value={currentVal || "0"} 
        readOnly 
      />
    </div>
  );
};

export default Display;
