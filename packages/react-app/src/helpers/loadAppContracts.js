const contractListPromise = import("../contracts/hardhat_contracts.json");
// @ts-ignore
const externalContractsPromise = import("../contracts/external_contracts.json");

export const loadAppContracts = async () => {
  const config = {};
  config.deployedContracts = (await contractListPromise).default ?? {};
  config.externalContracts = (await externalContractsPromise).default ?? {};
  // console.log("------------------------------------deployedContracts >>>>>>>>>>>>>>>>", config.deployedContracts);
  // console.log("------------------------------------externalContracts >>>>>>>>>>>>>>>>", config.externalContracts);
  return config;
};
