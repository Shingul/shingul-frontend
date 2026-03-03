"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CreateStudySetForm from "@/components/CreateStudySetForm";
import { getGameByCode } from "@/src/api/games.api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  HiOutlineDocumentText,
  HiOutlineCpuChip,
  HiOutlineClipboardDocumentList,
  HiOutlinePlay,
  HiOutlineCheck,
} from "react-icons/hi2";

export default function LandingPage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode.trim()) {
      toast.error("Please enter a game code");
      return;
    }

    setIsJoiningGame(true);
    try {
      const game = await getGameByCode(gameCode.trim().toUpperCase());
      router.push(`/study-sets/${game.studySetId}/games/${game.id}`);
    } catch {
      toast.error("Game not found. Please check the code and try again.");
      setIsJoiningGame(false);
    }
  };

  const features = [
    {
      icon: HiOutlineDocumentText,
      title: "Upload PDFs",
      description: "Drag and drop your study materials",
    },
    {
      icon: HiOutlineCpuChip,
      title: "AI Flashcards",
      description: "Automatically generate flashcards from your notes",
    },
    {
      icon: HiOutlineClipboardDocumentList,
      title: "AI Quizzes",
      description: "Test your knowledge with AI-generated quizzes",
    },
    {
      icon: HiOutlinePlay,
      title: "Live Quiz Games",
      description: "Compete with friends in real-time",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["5 study sets", "Basic flashcards", "Community quizzes"],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      features: [
        "Unlimited study sets",
        "AI flashcards & quizzes",
        "Live games",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Student",
      price: "$4.99",
      period: "month",
      features: [
        "Unlimited study sets",
        "AI flashcards & quizzes",
        "Live games",
        "Student discount",
      ],
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4 sm:mb-6 leading-tight">
                A calm place to study and{" "}
                <span className="bg-linear-to-r from-primary2 via-primary to-accent bg-clip-text text-transparent">
                  have fun with friends
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted mb-6 sm:mb-8">
                Upload notes. Study smarter. No signup required.
              </p>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative w-full aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                <Image
                  src="/banner.png"
                  alt="Shingul mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 -mt-25">
              <CreateStudySetForm wrapperClassName="" />
            </div>
            {/* <div className="flex items-center justify-center md:px-4">
              <span className="text-muted font-semibold text-sm md:text-base">
                OR
              </span>
            </div>
            <div className="flex-1">
              <div className="glass rounded-2xl p-3 sm:p-4 md:p-5 glow-primary">
                <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                  Join a Game
                </h2>
                <form onSubmit={handleJoinGame} className="space-y-3">
                  <div>
                    <label
                      htmlFor="game-code"
                      className="block text-xs sm:text-sm font-semibold text-text mb-1"
                    >
                      Enter Game Code
                    </label>
                    <input
                      id="game-code"
                      type="text"
                      value={gameCode}
                      onChange={(e) =>
                        setGameCode(e.target.value.toUpperCase())
                      }
                      placeholder="e.g., SHINGUL"
                      maxLength={6}
                      className="w-full px-3 py-2 glass rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                      disabled={isJoiningGame}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!gameCode.trim() || isJoiningGame}
                    className="w-full px-4 py-2.5 bg-linear-to-r from-primary to-primary2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                  >
                    {isJoiningGame ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Joining...
                      </>
                    ) : (
                      "Join Game"
                    )}
                  </button>
                </form>
              </div>
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted hover:text-text transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-text mb-8 sm:mb-12">
            Everything you need to study smarter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-transform glow-primary/50"
                >
                  <div className="text-4xl mb-4 flex justify-center"><Icon className="w-10 h-10 text-primary" /></div>
                  <h3 className="text-xl font-bold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-text mb-8 sm:mb-12">
            Choose your plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`glass rounded-2xl p-6 sm:p-8 relative ${
                  plan.popular
                    ? "border-2 border-primary glow-primary md:scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-primary to-accent rounded-full text-sm font-bold text-white">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-text mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-text">
                    {plan.price}
                  </span>
                  <span className="text-muted">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-center gap-2 text-muted"
                    >
                      <HiOutlineCheck className="w-5 h-5 text-primary2 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
