import { createContext, useState, useContext } from "react";
import { mockFrequencias } from "../mocks/data";

const FrequenciaContext = createContext(null);

export const FrequenciaProvider = ({ children }) => {
  const [frequencias, setFrequencias] = useState(mockFrequencias);

  const marcarFrequencia = (newFrequencia) => {
    const item = {
        id: `freq_${Date.now()}`,
        status: "Pendente",
        ...newFrequencia,
    };
    setFrequencias((prev) => [...prev, item]);
  };

    return (
        <FrequenciaContext.Provider value={{ frequencias, marcarFrequencia }}>
        {children}
        </FrequenciaContext.Provider>
    );
};

export const useFrequencia = () => {
  return useContext(FrequenciaContext);
};