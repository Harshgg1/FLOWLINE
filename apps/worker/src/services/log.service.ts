import prisma from '@flowline/db';
import { publishDeploymentLog } from './log.publisher';

export async function createDeploymentLog(deploymentId: string, message: string, type: 'INFO' | 'ERROR' | 'BUILD') {
    const log = await prisma.deploymentLog.create({
        data: {
            deploymentId,
            message,
            type
        }
    });

    await publishDeploymentLog(log);
    return log;
}