import { useEffect, useState } from "react";
import { motion } from "motion/react";

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onOver = (e) => {
      const el = e.target;
      const isClickable =
        el.tagName === "BUTTON" ||
        el.tagName === "A" ||
        el.closest("button") ||
        el.closest("a") ||
        window.getComputedStyle(el).cursor === "pointer";
      setHovering(!!isClickable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("pointerover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  )
    return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 99999,
        pointerEvents: "none",
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: clicking ? 0.6 : hovering ? 2.2 : 1,
      }}
      transition={{ scale: { duration: 0.12 }, opacity: { duration: 0.15 } }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#e85d26",
          boxShadow: clicking
            ? "0 0 4px #e85d26, 0 0 8px rgba(232,93,38,0.5)"
            : hovering
              ? "0 0 12px #e85d26, 0 0 24px rgba(232,93,38,0.5)"
              : "0 0 6px #e85d26, 0 0 12px rgba(232,93,38,0.3)",
        }}
      />
    </motion.div>
  );
}

export default CustomCursor;
