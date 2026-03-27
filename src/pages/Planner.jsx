import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { X, ChefHat, Calendar, Trash2, ArrowLeft } from "lucide-react";
import { useZesti } from "../context/ZestiContext";
import { truncate } from "../lib/utils";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function DraggableRecipe({ recipe, day }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${day}-${recipe.idMeal}`,
      data: { recipe, day },
    });

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 10px",
        background: "var(--bg-page)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--bg-elevated)",
        }}
      >
        {recipe.strMealThumb ? (
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🍽️
          </div>
        )}
      </div>

      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--text-primary)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {truncate(recipe.strMeal, 28)}
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flexShrink: 0,
          opacity: 0.3,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "2px",
              background: "var(--text-muted)",
              borderRadius: "1px",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DayColumn({ day, recipes, onRemove, isOver }) {
  const { setNodeRef } = useDroppable({ id: day });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? "var(--ember-light)" : "var(--bg-card)",
        border: isOver
          ? "2px dashed rgba(232,93,38,0.5)"
          : "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: "160px",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {day}
        </h3>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "11px",
            color: "var(--text-muted)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "2px 8px",
          }}
        >
          {recipes.length} meal{recipes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {recipes.length === 0 && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px dashed var(--border)",
            borderRadius: "10px",
            padding: "20px",
            color: "var(--text-muted)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            minHeight: "80px",
          }}
        >
          {isOver ? "✨ Drop here" : "Drag a recipe here"}
        </div>
      )}

      <AnimatePresence>
        {recipes.map((recipe) => (
          <div key={recipe.idMeal} style={{ position: "relative" }}>
            <DraggableRecipe recipe={recipe} day={day} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(day, recipe.idMeal)}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#e85d26",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                zIndex: 1,
              }}
            >
              <X size={10} />
            </motion.button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function DragPreview({ recipe }) {
  if (!recipe) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        background: "var(--bg-card)",
        border: "1px solid #e85d26",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(232,93,38,0.25)",
        opacity: 0.95,
        pointerEvents: "none",
        maxWidth: "200px",
      }}
    >
      {recipe.strMealThumb && (
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
          draggable={false}
        />
      )}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        {truncate(recipe.strMeal, 24)}
      </span>
    </div>
  );
}

function Planner() {
  const navigate = useNavigate();
  const { bookmarks, mealPlan, addToMealPlan, removeFromMealPlan } = useZesti();

  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveRecipe(event.active.data.current?.recipe || null);
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);
    setActiveRecipe(null);

    if (!over) return;

    const sourceDay = active.data.current?.day;
    const targetDay = over.id;
    const recipe = active.data.current?.recipe;

    if (!recipe || !DAYS.includes(targetDay)) return;

    if (!sourceDay || sourceDay === targetDay) {
      addToMealPlan(targetDay, recipe);
      return;
    }

    removeFromMealPlan(sourceDay, recipe.idMeal);
    addToMealPlan(targetDay, recipe);
  };

  const totalMeals = Object.values(mealPlan).reduce(
    (acc, day) => acc + day.length,
    0,
  );

  const clearAll = () => {
    DAYS.forEach((day) => {
      (mealPlan[day] || []).forEach((r) => removeFromMealPlan(day, r.idMeal));
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Planner header */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Back button — now uses useNavigate */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              <ArrowLeft size={14} />
              Back
            </motion.button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#e85d26",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} color="#fff" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Meal Planner
                </h1>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  {totalMeals} meal{totalMeals !== 1 ? "s" : ""} planned this
                  week
                </p>
              </div>
            </div>
          </div>

          {totalMeals > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "rgba(232,93,38,0.08)",
                border: "1px solid rgba(232,93,38,0.2)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#e85d26",
              }}
            >
              <Trash2 size={13} />
              Clear all
            </motion.button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left — saved recipes panel */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "16px",
            position: "sticky",
            top: "100px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 14px",
            }}
          >
            Saved recipes
          </h3>

          {bookmarks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 12px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔖</div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Save recipes first then drag them to your plan
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {bookmarks.map((recipe) => (
                <DraggableRecipe
                  key={recipe.idMeal}
                  recipe={recipe}
                  day={null}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — 7 day grid */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {DAYS.map((day) => (
              <DayColumn
                key={day}
                day={day}
                recipes={mealPlan[day] || []}
                onRemove={removeFromMealPlan}
                isOver={overId === day}
              />
            ))}
          </div>

          <DragOverlay>
            {activeRecipe && <DragPreview recipe={activeRecipe} />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default Planner;
