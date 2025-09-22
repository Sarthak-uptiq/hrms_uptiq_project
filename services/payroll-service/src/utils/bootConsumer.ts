import { connectRabbitMQ } from "../consumer/connectMQ.js";
import { payrollConsumer } from "../consumer/payrollConsumer.js";
import { roleConsumer } from "../consumer/roleCrudConsumer.js";

export const connect = async () => {
  try {
    await connectRabbitMQ();
  } catch (error) {
    console.log(error);
    return;
  }
}

export const bootRoleConsumer = async () => {
  try {
    await roleConsumer();
  } catch (err) {
    console.error("Error inside consumer", err);
  }
}

export const bootPayrollConsumer = async () => {
  try {
    await payrollConsumer();
  } catch (error) {
    console.log("Error while booting payroll: ", error);
  }
}