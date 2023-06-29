import { upgrades } from "hardhat";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:deployGreeter")
  .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const greeterFactory = await ethers.getContractFactory("Greeter");
    const greeter = await greeterFactory.connect(signers[0]).deploy(taskArguments.greeting);
    await greeter.waitForDeployment();
    console.log("Greeter deployed to: ", await greeter.getAddress());
  });

task("task:deployPizza").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const SLICES = 8;
  console.log("task:deployPizza");
  const pizzaFactory = await ethers.getContractFactory("Pizza");

  console.log("Deploying pizza ...");
  const pizza = await upgrades.deployProxy(pizzaFactory, [SLICES], {
    initializer: "initialize",
  });
  await pizza.waitForDeployment();
  console.log("Pizza deployed to: ", await pizza.getAddress());
});
