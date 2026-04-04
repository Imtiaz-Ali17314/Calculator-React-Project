import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Display from "./components/Display";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  const [currentVal, setCurrentVal] = useState("");
  const [previousVal, setPreviousVal] = useState("");
  const [operator, setOperator] = useState(null);
  const [expression, setExpression] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  const evaluate = (prev, curr, op) => {
    const p = parseFloat(prev);
    const c = parseFloat(curr);
    if (isNaN(p) || isNaN(c)) return "";
    switch (op) {
      case "+": return (p + c).toString();
      case "-": return (p - c).toString();
      case "*": return (p * c).toString();
      case "/": return c === 0 ? "Error" : (p / c).toString();
      default: return "";
    }
  };

  const handleAction = useCallback((action) => {
    // Numbers and Decimal
    if (/[0-9.]/.test(action)) {
      if (isCalculated) {
        setCurrentVal(action === "." ? "0." : action);
        setExpression("");
        setPreviousVal("");
        setOperator(null);
        setIsCalculated(false);
      } else {
        if (action === "." && currentVal.includes(".")) return;
        setCurrentVal((prev) => (prev === "0" && action !== "." ? action : prev + action));
      }
    } 
    // Operators
    else if (["+", "-", "*", "/"].includes(action)) {
      if (currentVal === "Error") return;
      
      let newPrev = previousVal;
      if (currentVal) {
        if (operator && previousVal && !isCalculated) {
          newPrev = evaluate(previousVal, currentVal, operator);
          setCurrentVal("");
        } else {
          newPrev = currentVal;
          setCurrentVal("");
        }
      }
      
      setPreviousVal(newPrev);
      setOperator(action);
      setExpression(`${newPrev} ${action}`);
      setIsCalculated(false);
    } 
    // Calculate
    else if (action === "=" || action === "Enter") {
      if (!operator || !previousVal || !currentVal) return;
      const result = evaluate(previousVal, currentVal, operator);
      setCurrentVal(result);
      setExpression(`${previousVal} ${operator} ${currentVal} =`);
      setPreviousVal("");
      setOperator(null);
      setIsCalculated(true);
    } 
    // Actions
    else if (action === "C" || action === "Escape") {
      setCurrentVal("");
      setPreviousVal("");
      setOperator(null);
      setExpression("");
      setIsCalculated(false);
    } 
    else if (action === "DEL" || action === "Backspace") {
      if (isCalculated || currentVal === "Error") {
        setCurrentVal("");
        setExpression("");
        setIsCalculated(false);
      } else {
        setCurrentVal((prev) => prev.slice(0, -1));
      }
    } 
    else if (action === "%") {
      if (currentVal && !isNaN(currentVal)) {
        setCurrentVal((parseFloat(currentVal) / 100).toString());
      }
    }
  }, [currentVal, previousVal, operator, isCalculated]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;
      // map keys
      if (key === "Enter") {
        e.preventDefault();
        handleAction("=");
      } else if (key === "Backspace") {
        handleAction("DEL");
      } else if (key === "Escape") {
        handleAction("C");
      } else if (["+", "-", "*", "/", "%", "="].includes(key)) {
        handleAction(key);
      } else if (/[0-9.]/.test(key)) {
        handleAction(key);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);

  return (
    <div className="calculator">
      <Display currentVal={currentVal} expression={expression} />
      <ButtonsContainer onButtonClick={handleAction} />
    </div>
  );
}

export default App;
