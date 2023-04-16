import { useState, useEffect } from "react";
import { loadAppContracts } from "../helpers/loadAppContracts";

export const useContractConfig = () => {
  const [contractsConfig, setContractsConfig] = useState({});

  useEffect(() => {
    const loadFunc = async () => {
      const result = await loadAppContracts();
      setContractsConfig(result);
      //console.log("------------------------------------result >>>>>>>>>>>>>>>>", result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};
