const hre = require("hardhat");

async function main() {
  const Funder = await hre.ethers.getContractFactory("Funder");
  const funder = await Funder.deploy();

  await funder.deployed();

  console.log(`Funder deployed to ${funder.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
