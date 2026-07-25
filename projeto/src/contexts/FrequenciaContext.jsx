import { createContext, useState, useContext } from "react";
import { mockFrequencias } from "../mocks/data";

const FrequenciaContext = createContext();

export const FrequenciaProvider = ({ children }) => {
  const [frequencias, setFrequencias] = useState(mockFrequencias);

  const addFrequencia = (newFrequencia) => {
    const item = {
        id: `freq_${Date.now()}`,
        status: "Pendente",
        ...newFrequencia,
    };
    setFrequencias((prev) => [...prev, item]);
  };

    return (
        <FrequenciaContext.Provider value={{ frequencias, addFrequencia }}>
        {children}
        </FrequenciaContext.Provider>
    );
};

export const useFrequencia = () => useContext(FrequenciaContext);