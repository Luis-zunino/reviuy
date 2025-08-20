"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // const { error } = await supabase.auth.signInWithOtp({
    //   email,
    //   options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    // });
    setLoading(false);
    // if (error) {
    //   toast.error("Error al enviar el enlace");
    // } else {
    //   toast.success("¡Revisa tu correo para continuar!");
    // }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
      <Input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar enlace de acceso"}
      </Button>
    </form>
  );
};

export default AuthForm;
