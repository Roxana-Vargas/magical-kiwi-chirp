import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizStart: React.FC = () => {
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) {
      setError("Por favor, ingresa tu DNI.");
      return;
    }
    localStorage.setItem("quiz_dni", dni.trim());
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] transition-colors duration-500">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-[#1E293B] border-none animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center">
          <User className="w-12 h-12 text-[#38BDF8] mb-4" />
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2 font-sans">QuizMaster AI</h1>
          <p className="text-[#F8FAFC] mb-6 text-center">Ingresa tu DNI para comenzar el cuestionario</p>
          <form className="w-full flex flex-col gap-4" onSubmit={handleStart}>
            <Input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={e => { setDni(e.target.value); setError(""); }}
              className="bg-[#0F172A] text-[#F8FAFC] border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8] rounded-lg"
              autoFocus
            />
            {error && <span className="text-[#EF4444] text-sm">{error}</span>}
            <Button
              type="submit"
              className="mt-2 bg-[#38BDF8] hover:bg-[#0ea5e9] text-[#0F172A] font-bold text-lg rounded-lg py-2 transition-all shadow-lg"
              size="lg"
            >
              Comenzar cuestionario
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizStart;