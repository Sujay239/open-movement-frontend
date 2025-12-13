import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router";
import { useAlert } from "../blocks/AlertProvider";

gsap.registerPlugin(ScrollTrigger);

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  title: string;
  price: string;
  priceId: string;
  frequency: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  buttonText: string;
}

const pricingData: PricingTier[] = [
  {
    title: "BASIC",
    price: "$99",
    priceId: "price_1SdQX0EOAFxwc3YvrlxXzpTc",
    frequency: "/month",
    description: "Essential access for immediate hiring needs.",
    buttonText: "Start Basic Plan",
    features: [
      { text: "Access verified teacher database", included: true },
      { text: "Basic filtering (Subject, Location)", included: true },
      { text: "5 Contact Requests per month", included: true },
      { text: "Standard Email Support", included: true },
      { text: "Advanced candidate insights", included: false },
      { text: "Interview scheduling tools", included: false },
    ],
  },
  {
    title: "PRO",
    price: "$499",
    priceId: "price_1SdQXUEOAFxwc3Yv3w2DRJuj",
    frequency: "/6 months",
    description: "Perfect for schools with ongoing recruitment.",
    popular: true,
    buttonText: "Get Started with Pro",
    features: [
      { text: "Everything in BASIC, plus:", included: true },
      { text: "Advanced filtering & Saved searches", included: true },
      { text: "30 Contact Requests per month", included: true },
      { text: "Candidate Shortlisting & Notes", included: true },
      { text: "Priority Email Support", included: true },
      { text: "Basic Interview Scheduling", included: false },
    ],
  },
  {
    title: "ULTIMATE",
    price: "$899",
    priceId: "price_1SdQYLEOAFxwc3Yv4fYOFbbg",
    frequency: "/year",
    description: "The complete toolkit for large scale hiring.",
    buttonText: "Contact Sales for Ultimate",
    features: [
      { text: "Everything in PRO, plus:", included: true },
      { text: "Unlimited Contact Requests", included: true },
      { text: "Full visa & qualification insights", included: true },
      { text: "Integrated Interview Scheduler", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Early access to new profiles", included: true },
    ],
  },
];

const BASE_URL = import.meta.env?.VITE_BASE_URL;

export const PricingSection = () => {
  const container = useRef<HTMLOptionElement>(null);
  const {showError} = useAlert();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#pricing",
          start: "top 80%", // Starts when top of section is 80% down the viewport
          toggleActions: "play none none reverse",
        },
      });

      // 1. Header Animation
      tl.fromTo(
        ".pricing-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // 2. Cards Staggered Entrance
      tl.fromTo(
        ".pricing-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2, // Cards appear one after another
          ease: "back.out(1.5)", // Slight bounce effect on arrival
        },
        "-=0.4" // Overlap slightly with header animation
      );
    },
    { scope: container }
  );

  async function handlePurchase(title: string, priceId: string): Promise<void> {
    try {
      const payload = {
        priceId: priceId,
        planId: title,
      };

      const res = await fetch(`${BASE_URL}/stripe/create-checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // <<< REQUIRED
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      } else {
        showError(data.reason);
        console.log("Error while creating the checkout session.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <section
        id="pricing"
        ref={container}
        className="container py-24 sm:py-32 relative flex flex-col items-center"
      >
        {/* Background visual accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl opacity-30 blur-[120px] bg-linear-to-tr from-primary/20 via-blue-500/10 to-purple-500/20 -z-10 pointer-events-none"></div>

        <div className="pricing-header text-center mb-16 space-y-4 opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple, Transparent{" "}
            <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:w-2/3 mx-auto">
            Choose the plan that fits your school's recruitment volume. No
            hidden fees, just direct access to qualified educators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-start">
          {pricingData.map((tier, _index) => (
            <Card
              key={tier.title}
              className={`pricing-card relative flex flex-col h-full overflow-hidden border transition-all duration-300 opacity-0
            ${
              tier.popular
                ? "border-primary/50 shadow-2xl shadow-primary/10 md:scale-105 z-10 bg-linear-to-b from-background to-primary/5"
                : "border-border hover:border-primary/30 hover:shadow-lg bg-card/50 backdrop-blur-sm"
            }`}
            >
              {tier.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary via-blue-500 to-primary"></div>
              )}

              <CardHeader className="pb-8 relative">
                {tier.popular && (
                  <Badge
                    variant="secondary"
                    className="absolute top-4 right-4 bg-primary/10 text-primary hover:bg-primary/20 gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </Badge>
                )}
                <CardTitle className="text-2xl font-bold uppercase tracking-wider text-muted-foreground">
                  {tier.title}
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-black tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {tier.frequency}
                  </span>
                </div>
                <CardDescription className="text-base mt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="grow">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="shrink-0 w-5 h-5" /> // Spacer
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50 line-through"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8">
                <Button
                  className={`cursor-pointer w-full h-12 text-base font-semibold transition-all duration-300 ${
                    tier.popular
                      ? "bg-primary  shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] hover:bg-green-400"
                      : "hover:scale-[1.02]"
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handlePurchase(tier.title, tier.priceId)}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Link to="/">
          <Button className="mt-10 mx-auto cursor-pointer hover:scale-110 transition-transform duration-200 hover:bg-green-400">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home page
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default PricingSection;
