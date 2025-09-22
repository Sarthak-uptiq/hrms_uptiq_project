import { addPayroll, getAllPayrolls } from "../repository/payroll_repository.js";
export const getPayrollController = async (req, res, next) => {
    try {
        const all_payrolls = await getAllPayrolls();
        if (!all_payrolls) {
            return res.status(404).json("Request failed");
        }
        return res.status(200).json({
            message: "Returning payrolls",
            payload: all_payrolls
        });
    }
    catch (error) {
        next(error);
    }
};
export const addPayrollController = async (payload) => {
    try {
        const payroll = await addPayroll(payload);
        if (!payroll) {
            throw new Error("Failed to consume add payroll");
        }
        console.log("Payroll added");
        return { payroll: payroll };
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
