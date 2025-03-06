"use client"

import { useState } from "react"
import LoanDetailsForm from "@/components/loan-details-form"
import ExtraPaymentOptions from "@/components/extra-payment-options"
import ResultsVisualization from "@/components/results-visualization"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export type LoanDetails = {
  loanAmount: number
  interestRate: number
  loanTerm: number
  startDate: Date
}

export type ExtraPayments = {
  paymentType: "monthly" | "yearly" | "both"
  extraMonthlyAmount: number
  yearlyLumpSum: number
  yearsToApplyLumpSum: number
}

export default function LoanSimulator() {
  const [step, setStep] = useState(1)
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0,
    startDate: new Date(),
  })
  const [extraPayments, setExtraPayments] = useState<ExtraPayments>({
    paymentType: "monthly",
    extraMonthlyAmount: 0,
    yearlyLumpSum: 0,
    yearsToApplyLumpSum: 1,
  })

  const handleLoanDetailsSubmit = (data: LoanDetails) => {
    setLoanDetails(data)
    setStep(2)
  }

  const handleExtraPaymentsSubmit = (data: ExtraPayments) => {
    setExtraPayments(data)
    setStep(3)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleReset = () => {
    setStep(1)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Amortization Simulator</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Visualize how extra payments can save you time and money
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={step * 33.33} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className={step >= 1 ? "font-medium text-primary" : ""}>Loan Details</span>
          <span className={step >= 2 ? "font-medium text-primary" : ""}>Payment Options</span>
          <span className={step >= 3 ? "font-medium text-primary" : ""}>Results</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && <LoanDetailsForm onSubmit={handleLoanDetailsSubmit} initialData={loanDetails} />}
          {step === 2 && (
            <ExtraPaymentOptions onSubmit={handleExtraPaymentsSubmit} onBack={handleBack} initialData={extraPayments} />
          )}
          {step === 3 && (
            <ResultsVisualization
              loanDetails={loanDetails}
              extraPayments={extraPayments}
              onBack={handleBack}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

