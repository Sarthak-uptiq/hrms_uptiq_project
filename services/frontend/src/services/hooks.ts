import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllEmployees,
  createEmployee,
  updateEmployeeStatus,
  terminateEmployee,
  getEmployeeDetails,
  updateEmployeeDetails,
} from './api';

// Employee self-service
export const useEmployeeDetails = () => useQuery(['employeeDetails'], getEmployeeDetails);
export const useUpdateEmployeeDetails = () => {
  const queryClient = useQueryClient();
  return useMutation((update: any) => updateEmployeeDetails(update), {
    onSuccess: () => queryClient.invalidateQueries(['employeeDetails']),
  });
};

// HR
export const useAllEmployees = () => useQuery(['allEmployees'], getAllEmployees);
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation((newEmp: any) => createEmployee(newEmp), {
    onSuccess: () => queryClient.invalidateQueries(['allEmployees']),
  });
};
export const useUpdateEmpStatus = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: { id: string; statusToUpdate: 'EMP_STATUS' | 'POLICY'; status_flag: 'ACTIVE' | 'INACTIVE' | 'ACK' | 'NOT_ACK'; email: string; }) => updateEmployeeStatus(payload), {
    onSuccess: () => queryClient.invalidateQueries(['allEmployees']),
  });
};
export const useTerminateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: { id: string }) => terminateEmployee(payload), {
    onSuccess: () => queryClient.invalidateQueries(['allEmployees']),
  });
};
