import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Display from "./components/Display";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  const [currentVal, setCurrentVal] = useState("");
  const [previousVal, setPreviousVal] = useState("");
  const [operator, setOperator] = useState(null);
  const [expression, setExpression] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);
  
  const wrapperRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)" });

  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Smooth 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    wrapperRef.current.style.setProperty("--mouseX", `${x}px`);
    wrapperRef.current.style.setProperty("--mouseY", `${y}px`);

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out" // fast tracking
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" // smooth return
    });
  };

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
      let opSymbol = action === "*" ? "×" : action === "/" ? "÷" : action;
      setExpression(`${newPrev} ${opSymbol}`);
      setIsCalculated(false);
    } 
    else if (action === "=" || action === "Enter") {
      if (!operator || !previousVal || !currentVal) return;
      const result = evaluate(previousVal, currentVal, operator);
      setCurrentVal(result);
      let opSymbol = operator === "*" ? "×" : operator === "/" ? "÷" : operator;
      setExpression(`${previousVal} ${opSymbol} ${currentVal} =`);
      setPreviousVal("");
      setOperator(null);
      setIsCalculated(true);
    } 
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;
      if (key === "Enter") { e.preventDefault(); handleAction("="); }
      else if (key === "Backspace") handleAction("DEL");
      else if (key === "Escape") handleAction("C");
      else if (["+", "-", "*", "/", "%", "="].includes(key)) handleAction(key);
      else if (/[0-9.]/.test(key)) handleAction(key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAction]);

  return (
    <div 
      className="calculator-wrapper" 
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="calculator" style={tiltStyle}>
        <div className="glare" />
        <div className="calc-inner">
          <Display currentVal={currentVal} expression={expression} />
          <ButtonsContainer onButtonClick={handleAction} />
        </div>
      </div>
    </div>
  );
}

export default App;
