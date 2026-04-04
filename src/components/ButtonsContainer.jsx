import styles from "./ButtonsContainer.module.css";

const ButtonsContainer = ({ onButtonClick }) => {
  const buttons = [
    { label: "C", type: "clear" },
    { label: "DEL", type: "clear" },
    { label: "%", type: "operator" },
    { label: "÷", type: "operator", value: "/" },
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "×", type: "operator", value: "*" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "-", type: "operator" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "+", type: "operator" },
    { label: "0", type: "number" },
    { label: ".", type: "number" },
    { label: "=", type: "calculate" },
  ];

  return (
    <div className={styles.buttonsContainer}>
      {buttons.map((btn) => (
        <button
          key={btn.label}
          className={`${styles.button} ${styles[btn.type]}`}
          onClick={() => onButtonClick(btn.value || btn.label)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonsContainer;
