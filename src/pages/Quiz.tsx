import React, { useEffect, useState } from "react";
import preguntas from "@/data/preguntas.json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuesta: string;
};

type RespuestaUsuario = {
  pregunta: string;
  seleccionada: string;
  correcta: string;
  esCorrecta: boolean;
};

const ANIMATION_DURATION = 400;

const Quiz: React.FC = () => {
  const [indice, setIndice] = useState(0);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correcta" | "incorrecta" | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestaUsuario[]>([]);
  const [animando, setAnimando] = useState(false);
  const navigate = useNavigate();

  const total = preguntas.length;

  useEffect(() => {
    setSeleccionada(null);
    setFeedback(null);
  }, [indice]);

  const handleSeleccion = (opcion: string) => {
    if (seleccionada || animando) return;
    setSeleccionada(opcion);
    const esCorrecta = opcion === preguntas[indice].respuesta;
    setFeedback(esCorrecta ? "correcta" : "incorrecta");
    setRespuestas(prev => [
      ...prev,
      {
        pregunta: preguntas[indice].pregunta,
        seleccionada: opcion,
        correcta: preguntas[indice].respuesta,
        esCorrecta,
      },
    ]);
    setAnimando(true);
    setTimeout(() => {
      setAnimando(false);
      if (indice + 1 < total) {
        setIndice(indice + 1);
      } else {
        navigate("/result", { state: { respuestas: [...respuestas, {
          pregunta: preguntas[indice].pregunta,
          seleccionada: opcion,
          correcta: preguntas[indice].respuesta,
          esCorrecta,
        }] } });
      }
    }, ANIMATION_DURATION + 600);
  };

  // Animación de entrada
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] transition-colors duration-500">
      <Card className={clsx(
        "w-full max-w-xl shadow-xl rounded-2xl bg-[#1E293B] border-none animate-fade-in",
        animando && "animate-pulse"
      )}>
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#F8FAFC] font-medium">
              Pregunta {indice + 1} de {total}
            </span>
            <Progress
              value={((indice + (feedback ? 1 : 0)) / total) * 100}
              className="w-32 h-2 bg-[#0F172A] [&>*]:bg-[#38BDF8]"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6 min-h-[56px]">{preguntas[indice].pregunta}</h2>
          <div className="flex flex-col gap-4">
            {preguntas[indice].opciones.map((op, i) => {
              const isSelected = seleccionada === op;
              const isCorrect = feedback === "correcta" && isSelected;
              const isIncorrect = feedback === "incorrecta" && isSelected;
              const showCorrect = feedback === "incorrecta" && preguntas[indice].respuesta === op;
              return (
                <Button
                  key={op}
                  disabled={!!seleccionada}
                  onClick={() => handleSeleccion(op)}
                  className={clsx(
                    "justify-between w-full text-lg rounded-lg py-6 transition-all duration-300 shadow-md border-2",
                    "bg-[#0F172A] text-[#F8FAFC] hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]",
                    isCorrect && "bg-[#10B981]/80 border-[#10B981] text-white animate-pop",
                    isIncorrect && "bg-[#EF4444]/80 border-[#EF4444] text-white animate-shake",
                    showCorrect && "border-[#10B981] bg-[#10B981]/30"
                  )}
                >
                  <span>{op}</span>
                  {isCorrect && <CheckCircle2 className="ml-2 text-white" />}
                  {isIncorrect && <XCircle className="ml-2 text-white" />}
                  {showCorrect && <CheckCircle2 className="ml-2 text-white" />}
                </Button>
              );
            })}
          </div>
          {feedback && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {feedback === "correcta" ? (
                <span className="text-[#10B981] text-xl font-bold animate-bounce">¡Correcto! 🎉</span>
              ) : (
                <span className="text-[#EF4444] text-xl font-bold animate-shake">
                  Incorrecto. Respuesta correcta: <b>{preguntas[indice].respuesta}</b>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;