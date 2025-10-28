import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle2, XCircle, RefreshCcw, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

type RespuestaUsuario = {
  pregunta: string;
  seleccionada: string;
  correcta: string;
  esCorrecta: boolean;
};

const COLORS = ["#10B981", "#EF4444"];

const getMensaje = (porcentaje: number) => {
  if (porcentaje === 100) return "¡Excelente! 🏆";
  if (porcentaje >= 70) return "¡Muy bien! Sigue así 💪";
  if (porcentaje >= 50) return "¡Puedes mejorar! 🚀";
  return "¡No te rindas! Inténtalo de nuevo 🙌";
};

const QuizResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const respuestas: RespuestaUsuario[] = location.state?.respuestas || [];
  const total = respuestas.length;
  const correctas = respuestas.filter(r => r.esCorrecta).length;
  const porcentaje = Math.round((correctas / total) * 100);

  useEffect(() => {
    if (!respuestas.length) navigate("/");
  }, [respuestas, navigate]);

  const handleRetry = () => {
    navigate("/quiz", { replace: true });
  };

  const handleSave = async () => {
    setGuardando(true);
    const dni = localStorage.getItem("quiz_dni") || "Desconocido";
    const payload = {
      nombre: dni,
      fecha: new Date().toISOString(),
      correctas,
      total,
      porcentaje,
    };
    try {
      const res = await fetch("https://68f7ca9bf7fb897c66171beb.mockapi.io/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar resultado");
      showSuccess("¡Resultado guardado exitosamente!");
    } catch {
      showError("No se pudo guardar el resultado.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] transition-colors duration-500">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-[#1E293B] border-none animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">Resultados</h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 my-6">
            <div className="w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Correctas", value: correctas },
                      { name: "Incorrectas", value: total - correctas },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell key="correctas" fill={COLORS[0]} />
                    <Cell key="incorrectas" fill={COLORS[1]} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute text-3xl font-bold text-[#F8FAFC]">{porcentaje}%</span>
            </div>
            <div className="flex flex-col gap-2 text-[#F8FAFC]">
              <span>
                <CheckCircle2 className="inline mr-1 text-[#10B981]" /> Correctas: <b>{correctas}</b>
              </span>
              <span>
                <XCircle className="inline mr-1 text-[#EF4444]" /> Incorrectas: <b>{total - correctas}</b>
              </span>
              <span>
                Total de preguntas: <b>{total}</b>
              </span>
              <span>
                Porcentaje de aciertos: <b>{porcentaje}%</b>
              </span>
            </div>
          </div>
          <div className="mb-4 text-xl font-semibold text-[#38BDF8]">{getMensaje(porcentaje)}</div>
          {respuestas.some(r => !r.esCorrecta) && (
            <div className="w-full bg-[#0F172A] rounded-lg p-4 mb-4 shadow-inner">
              <h3 className="text-lg font-bold text-[#EF4444] mb-2">Preguntas falladas:</h3>
              <ul className="list-disc pl-6 text-[#F8FAFC] space-y-1">
                {respuestas.filter(r => !r.esCorrecta).map((r, i) => (
                  <li key={i}>
                    <span className="font-semibold">{r.pregunta}</span>
                    <br />
                    <span className="text-[#EF4444]">Tu respuesta: {r.seleccionada}</span>
                    <br />
                    <span className="text-[#10B981]">Correcta: {r.correcta}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleRetry}
              className="bg-[#38BDF8] hover:bg-[#0ea5e9] text-[#0F172A] font-bold rounded-lg px-6 py-2 flex items-center gap-2 shadow"
              size="lg"
            >
              <RefreshCcw className="w-5 h-5" /> Volver a intentarlo
            </Button>
            <Button
              onClick={handleSave}
              disabled={guardando}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg px-6 py-2 flex items-center gap-2 shadow"
              size="lg"
            >
              <Save className="w-5 h-5" /> {guardando ? "Guardando..." : "Guardar resultado"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResult;