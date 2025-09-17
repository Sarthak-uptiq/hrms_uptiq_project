import { connectRabbitMQ } from "../consumer/connectMQ.ts";
import { payrollConsumer } from "../consumer/payrollConsumer.ts";
import { roleConsumer } from "../consumer/roleCrudConsumer.ts";

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