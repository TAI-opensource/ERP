"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Check,
  X,
  Zap,
  Building,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with basic ERP features.",
    features: [
      { name: "Up to 3 users", included: true },
      { name: "Basic accounting", included: true },
      { name: "Inventory management", included: true },
      { name: "1 GB storage", included: true },
      { name: "Email support", included: true },
      { name: "Advanced reporting", included: false },
      { name: "Custom workflows", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Current Plan",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams that need more power and flexibility.",
    popular: true,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "Full accounting suite", included: true },
      { name: "Advanced inventory", included: true },
      { name: "10 GB storage", included: true },
      { name: "Priority email support", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Custom workflows", included: true },
      { name: "API access", included: true },
      { name: "Phone support", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Upgrade to Pro",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations with advanced requirements.",
    features: [
      { name: "Unlimited users", included: true },
      { name: "Full accounting suite", included: true },
      { name: "Advanced inventory", included: true },
      { name: "Unlimited storage", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Custom workflows", included: true },
      { name: "Full API access", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
]

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the credit will be applied to your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Enterprise plans.",
  },
  {
    question: "Is there a free trial for the Pro plan?",
    answer: "Yes, we offer a 14-day free trial of the Pro plan with full access to all features. No credit card required to start.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer: "Your data is always safe. If you exceed the limits of a lower plan, some features may be restricted but your data will never be deleted.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact support for a full refund.",
  },
]

const comparisonFeatures = [
  { feature: "Users", free: "3", pro: "25", enterprise: "Unlimited" },
  { feature: "Storage", free: "1 GB", pro: "10 GB", enterprise: "Unlimited" },
  { feature: "Accounting", free: "Basic", pro: "Full Suite", enterprise: "Full Suite" },
  { feature: "Inventory", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
  { feature: "Reporting", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { feature: "Workflows", free: "-", pro: "Custom", enterprise: "Custom" },
  { feature: "API Access", free: "-", pro: "REST API", enterprise: "REST + GraphQL" },
  { feature: "Support", free: "Email", pro: "Email + Phone", enterprise: "24/7 Dedicated" },
  { feature: "Integrations", free: "-", pro: "Pre-built", enterprise: "Custom" },
  { feature: "Audit Log", free: "-", pro: "90 days", enterprise: "Unlimited" },
]

export default function UpgradePage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Pro</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features to grow your business. Choose the plan that fits your needs.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular
                ? "border-primary shadow-lg scale-[1.02]"
                : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    {feature.included ? (
                      <Check className="size-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="size-4 text-muted-foreground/50 shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground/50"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.variant}
                className="w-full"
                disabled={plan.name === "Free"}
              >
                {plan.cta}
                {plan.name !== "Free" && (
                  <ArrowRight className="ml-2 size-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          Feature Comparison
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Pro</TableHead>
                <TableHead className="text-center">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center">{row.free}</TableCell>
                  <TableCell className="text-center font-medium">
                    {row.pro}
                  </TableCell>
                  <TableCell className="text-center">{row.enterprise}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Separator className="max-w-5xl mx-auto" />

      {/* FAQ */}
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card key={idx}>
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="size-5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{faq.question}</span>
                </div>
                <svg
                  className={`size-4 shrink-0 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <Sparkles className="size-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">
              Ready to supercharge your ERP?
            </h3>
            <p className="opacity-90 mb-6">
              Join thousands of businesses already using Pro to streamline their operations.
            </p>
            <Button variant="secondary" size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
