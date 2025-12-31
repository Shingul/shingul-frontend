"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

type UploadState = "idle" | "uploading" | "processing" | "error";

export default function LandingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploadState("uploading");
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(progressInterval);
    setUploadProgress(100);
    setUploadState("processing");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success - redirect to new study set
    const newId = Date.now().toString();
    router.push(`/study-sets/${newId}`);
  };
  const features = [
    {
      icon: "📄",
      title: "Upload PDFs",
      description: "Drag and drop your study materials",
    },
    {
      icon: "🤖",
      title: "AI Flashcards",
      description: "Automatically generate flashcards from your notes",
    },
    {
      icon: "📝",
      title: "AI Quizzes",
      description: "Test your knowledge with AI-generated quizzes",
    },
    {
      icon: "🎮",
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
                Turn your PDFs into{" "}
                <span className="bg-linear-to-r from-primary2 via-primary to-accent bg-clip-text text-transparent">
                  flashcards & quizzes
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted mb-6 sm:mb-8">
                Upload notes. Study smarter. No signup required.
              </p>

              {/* Study Set Creation Form */}
              <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 glow-primary mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">
                  Create Your Study Set
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-text mb-2"
                    >
                      Study Set Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Introduction to Astronomy"
                      className="w-full px-4 py-3 glass rounded-xl text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={uploadState !== "idle"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Upload PDFs
                    </label>
                    <div className="glass rounded-xl p-4 sm:p-6 md:p-8 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
                          📄
                        </div>
                        <p className="text-text font-semibold mb-2 text-xs sm:text-sm">
                          Drag & drop PDF files here
                        </p>
                        <p className="text-muted text-xs mb-2 sm:mb-3">or</p>
                        <button
                          type="button"
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-xs sm:text-sm"
                          disabled={uploadState !== "idle"}
                        >
                          Upload multiple PDFs
                        </button>
                      </div>
                    </div>
                  </div>

                  {uploadState === "uploading" && (
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <LoadingSpinner size="sm" />
                        <span className="text-text text-sm">Uploading...</span>
                      </div>
                      <div className="w-full bg-bg-1 rounded-full h-2">
                        <div
                          className="bg-linear-to-r from-primary to-primary2 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-2">
                        {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {uploadState === "processing" && (
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <LoadingSpinner size="sm" />
                        <div>
                          <p className="text-text font-semibold text-sm">
                            Processing...
                          </p>
                          <p className="text-xs text-muted">
                            Extracting text and generating content
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="glass rounded-xl p-4 bg-red-500/20 border border-red-500/50">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploadState !== "idle" || !title.trim()}
                    className="w-full px-6 py-3 bg-linear-to-r from-primary to-primary2 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadState === "idle"
                      ? "Create & Generate Flashcards"
                      : uploadState === "uploading"
                        ? "Uploading..."
                        : "Processing..."}
                  </button>
                </form>
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-text mb-8 sm:mb-12">
            Everything you need to study smarter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 hover:scale-105 transition-transform glow-primary/50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
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
                      <span className="text-primary2">✓</span>
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
