"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type DeploymentLog = {
  id?: string;
  deploymentId: string;
  message: string;
  type: "INFO" | "BUILD" | "ERROR";
  createdAt?: string;
  timestamp?: number;
};

export default function DeploymentPage({params,}: {params: Promise<{ deploymentId: string }>;}) {
  const [deploymentId, setDeploymentId] = useState("");
  const [logs, setLogs] = useState<DeploymentLog[]>([]);

  useEffect(() => {
    let socket: Socket | null = null;

    async function setup() {
      const { deploymentId } = await params;

      setDeploymentId(deploymentId);
      
      // new logs
      socket = io(
        process.env.NEXT_PUBLIC_BACKEND_URL!
      );

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);

        socket?.emit(
          "join-deployment",
          deploymentId
        );
      });

      socket.on("deployment-log",(log: DeploymentLog) => {
          console.log("New log:", log);

          setLogs((current) => {
            if (log.id && current.some((existing) => existing.id === log.id)) {
              return current;
            }
            return [...current, log];
          });
        }
      );

      socket.on("connect_error", (error) => {
        console.error(
          "Socket error:",
          error
        );
      });

      // logs that already exist
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/deployments/${deploymentId}/logs`
      );

      if (!response.ok) {
        console.error("Failed to fetch deployment logs");
        return;
      }

      const historicalLogs: DeploymentLog[] =
        await response.json();

      setLogs((current) => {
          const combined = [
              ...historicalLogs,
              ...current
          ];

          const unique = new Map(
              combined.map((log) => [log.id, log])
          );

          return Array.from(unique.values()).sort(
              (a, b) =>
                  new Date(a.createdAt!).getTime() -
                  new Date(b.createdAt!).getTime()
          );
      });

    }

    setup();

    return () => {
      socket?.disconnect();
    };
  }, [params]);

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-6 text-2xl font-bold">
        Deployment
      </h1>

      <p className="mb-4 text-sm text-gray-400">
        {deploymentId}
      </p>

      <div className="rounded-lg bg-zinc-950 p-5 font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500">
            No logs yet...
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id ?? `${log.timestamp}-${index}`}
              className="mb-1"
            >
              <span className="mr-3 text-gray-500">
                {log.createdAt
                  ? new Date(
                      log.createdAt
                    ).toLocaleTimeString()
                  : ""}
              </span>

              <span
                className={
                  log.type === "ERROR"
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}