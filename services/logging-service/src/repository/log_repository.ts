import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type SchemaType = 'emp_logs' | 'role_logs' | 'dept_logs' | 'notification_logs';

const getPrismaModel = (schemaType: SchemaType) => {
    switch (schemaType) {
        case 'emp_logs':
            return prisma.emp_logs;

        case 'role_logs':
            return prisma.role_logs;

        case 'dept_logs':
            return prisma.dept_logs;

        case 'notification_logs':
            return prisma.notification_logs;

        default:

            const _exhaustiveCheck: never = schemaType;
            console.error(`Unhandled schema type: ${_exhaustiveCheck}`);
            throw new Error(`Invalid schemaType provided: ${_exhaustiveCheck}`);
    }
};

export const logEvent = async (logType: SchemaType, payload: any) => {
    try {
        const prismaModel = getPrismaModel(logType);

        const result = await (prismaModel.create as any)({
            data: payload,
        });

        console.log(`Successfully logged event for type: ${logType}`);
        return result;

    } catch (error) {
        console.error(`Failed to log event for type: ${logType}. Error:`, error);
        return error;
    }
};

