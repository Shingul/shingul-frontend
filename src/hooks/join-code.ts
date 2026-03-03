import { useState } from "react";
import toast from "react-hot-toast";

export const useJoinCode = (code: string) => {
  const [isJoining, setIsJoining] = useState(false);
  const url = 'http://localhost:3000';
//   const ip = `${process.env.NEXT_FRONTEND_PUBLIC_IP}`;
  const joinUrl = `${url}/join?code=${code}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Game code copied!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success("Join URL copied!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleJoin = async () => {
    setIsJoining(true);
  };

  return {
    isJoining,
    joinUrl,
    handleJoin,
    handleCopyCode,
    handleCopyUrl,
  };
};