import { addPayrollController } from "../controller/payroll_controller.js";
import { getAllTaxSlabs } from "../repository/payroll_repository.js";
import { getAllRoles } from "../repository/role_event_repository.js";
export class PayrollEventConsumer {
    async consumeEvent(event, payload) {
        try {
            console.log("reached");
            const new_payroll = await this.calculatePayroll(payload);
            console.log("Payroll calculation done");
            if (!new_payroll) {
                throw new Error();
            }
            const payroll = await addPayrollController(new_payroll);
            if (!payroll) {
                throw new Error("Failed to consume add payroll");
            }
            console.log("Payroll added successfully");
            return { message: "new payroll added", payroll: payroll };
        }
        catch (error) {
            console.log(error);
            return { error: error };
        }
    }
    calculatePayroll = async (payload) => {
        try {
            const [roles, taxSlabs] = await Promise.all([
                getAllRoles(),
                getAllTaxSlabs(),
            ]);
            let totalEmployees = 0;
            let totalGross = 0;
            let totalNet = 0;
            payload.map((event) => {
                const role = roles.find((r) => r.role_name === event.role_name);
                if (!role) {
                    throw new Error(`Role not found: ${event.role_name}`);
                }
                const grossPerEmp = role.base_salary + role.allowance + role.bonus;
                const totalGrossForRole = grossPerEmp * event.role_emp_count;
                const taxSlab = taxSlabs.find((slab) => grossPerEmp >= slab.tax_slab_min &&
                    grossPerEmp <= slab.tax_slab_max);
                const taxPerEmp = taxSlab
                    ? (grossPerEmp * taxSlab.deduction_percentage) / 100
                    : 0;
                const netPerEmp = grossPerEmp - taxPerEmp;
                const totalNetForRole = netPerEmp * event.role_emp_count;
                totalEmployees += event.role_emp_count;
                totalGross += totalGrossForRole;
                totalNet += totalNetForRole;
            });
            const summary = {
                total_employees: totalEmployees,
                gross_amount: totalGross,
                net_amount: totalNet,
                status: "COMPLETED",
            };
            return summary;
        }
        catch (error) {
            console.error("Error calculating payroll:", error);
            throw error;
        }
    };
}
