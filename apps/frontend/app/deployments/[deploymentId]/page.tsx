"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

type DeploymentLog = {
  deploymentId: string;
  message: string;
  type: "INFO" | "BUILD" | "ERROR";
  timestamp: number;
};

export default function DeploymentPage({params}: {params: Promise<{ deploymentId: string }>}) {
  useEffect(() => {
    let socket: ReturnType<typeof io> | null = null;
    let cancelled = false;

    async function setup() {
        const { deploymentId } = await params;

        if (cancelled) return;

        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("Socket connected:", socket?.id);

            socket?.emit("join-deployment", deploymentId);
        });

        socket.on("deployment-log", (log: DeploymentLog) => {
            console.log("LIVE DEPLOYMENT LOG:", log);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
    }

    setup();

    return () => {
        cancelled = true;
        socket?.disconnect();
        socket = null;
    };
}, [params]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Flowline Deployment
      </h1>

      <p className="mt-2">
        Open the browser console to see live logs.
      </p>
    </main>
  );
}