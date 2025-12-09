import React, { createContext, useContext, useEffect, useState } from "react";
import apiAuth from "@/lib/apiAuth";
import { useNavigate } from "react-router-dom";

type AuthState = {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (u: any) => void;
  ready: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nn_token"));
  const [user, setUser] = useState<any | null>(() => {
    const s = localStorage.getItem("nn_user") ?? localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        try {
          const me = await apiAuth.me(token);
          setUser(me);
          localStorage.setItem("nn_user", JSON.stringify(me));
        } catch (err) {
          setToken(null);
          setUser(null);
          localStorage.removeItem("nn_token");
          localStorage.removeItem("nn_user");
          localStorage.removeItem("user");
        }
      }
      setReady(true);
    };
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await apiAuth.login(email, password);
    const tok = resp.token ?? resp.accessToken ?? resp.data?.token ?? null;
    const usr = resp.user ?? resp.data?.user ?? resp.data ?? resp ?? null;

    if (!tok) {
      if (resp && typeof resp === "object" && (resp as any).token) {
        localStorage.setItem("nn_token", (resp as any).token);
        setToken((resp as any).token);
      } else {
        throw new Error("Respuesta de login no contiene token. Asegúrate que el backend devuelva token.");
      }
    } else {
      localStorage.setItem("nn_token", tok as string);
      setToken(tok as string);
    }
    if (usr) {
      // normalizamos y guardamos
      localStorage.setItem("nn_user", JSON.stringify(usr));
      localStorage.setItem("user", JSON.stringify(usr)); // compatibilidad
      setUser(usr);
    }
    return resp;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("nn_token");
    localStorage.removeItem("nn_user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateUser = (u: any) => {
    setUser(u);
    try {
      localStorage.setItem("nn_user", JSON.stringify(u));
      localStorage.setItem("user", JSON.stringify(u)); // compatibilidad
    } catch (e) {
      // ignore
    }
  };

  return <AuthContext.Provider value={{ token, user, login, logout, updateUser, ready }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};