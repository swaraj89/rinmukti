"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LoanDetails, ExtraPayments } from "./loan-simulator"
import { formatCurrency } from "@/lib/utils"
import AmortizationChart from "./amortization-chart"
import AmortizationTable from "./amortization-table"

interface ResultsVisualizationProps {
  loanDetails: LoanDetails
  extraPayments: ExtraPayments
  onBack: () => void
  onReset: () => void
}

interface AmortizationData {
  month: number
  standardBalance: number
  extraBalance: number
  standardPrincipal: number
  standardInterest: number
  extraPrincipal: number
  extraInterest: number
}

export default function ResultsVisualization({
  loanDetails,
  extraPayments,
  onBack,
  onReset,
}: ResultsVisualizationProps) {
  const [amortizationData, setAmortizationData] = useState<AmortizationData[]>([])
  const [standardSummary, setStandardSummary] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    payoffDate: new Date(),
  })
  const [extraSummary, setExtraSummary] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    payoffDate: new Date(),
    interestSaved: 0,
    timeSaved: 0,
  })

  useEffect(() => {
    // Calculate amortization schedule
    calculateAmortization()
  }, [loanDetails, extraPayments])

  const calculateAmortization = () => {
    const { loanAmount, interestRate, loanTerm, startDate } = loanDetails
    const { paymentType, extraMonthlyAmount, yearlyLumpSum, yearsToApplyLumpSum } = extraPayments

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12

    // Total number of payments
    const totalPayments = loanTerm * 12

    // Calculate standard monthly payment (PMT formula)
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments))

    // Initialize variables for standard payment
    let standardBalance = loanAmount
    let standardTotalInterest = 0

    // Initialize variables for extra payment
    let extraBalance = loanAmount
    let extraTotalInterest = 0
    const extraMonthlyPaymentTotal =
      monthlyPayment + (paymentType === "monthly" || paymentType === "both" ? extraMonthlyAmount : 0)

    // Create amortization data
    const data: AmortizationData[] = []

    for (let month = 1; month <= totalPayments && (standardBalance > 0 || extraBalance > 0); month++) {
      // Standard payment calculations
      const standardInterest = standardBalance > 0 ? standardBalance * monthlyRate : 0
      const standardPrincipal = standardBalance > 0 ? Math.min(monthlyPayment - standardInterest, standardBalance) : 0
      standardTotalInterest += standardInterest
      standardBalance = Math.max(0, standardBalance - standardPrincipal)

      // Extra payment calculations
      const extraInterest = extraBalance > 0 ? extraBalance * monthlyRate : 0
      let extraPrincipal = extraBalance > 0 ? Math.min(extraMonthlyPaymentTotal - extraInterest, extraBalance) : 0

      // Add yearly lump sum if applicable
      if (
        (paymentType === "yearly" || paymentType === "both") &&
        month % 12 === 0 &&
        Math.ceil(month / 12) <= yearsToApplyLumpSum &&
        extraBalance > 0
      ) {
        extraPrincipal += Math.min(yearlyLumpSum, extraBalance)
      }

      extraTotalInterest += extraInterest
      extraBalance = Math.max(0, extraBalance - extraPrincipal)

      data.push({
        month,
        standardBalance,
        extraBalance,
        standardPrincipal,
        standardInterest,
        extraPrincipal,
        extraInterest,
      })

      // Break if both balances are paid off
      if (standardBalance === 0 && extraBalance === 0) break
    }

    // Calculate payoff dates and summaries
    const standardPayoffMonth = data.findIndex((d) => d.standardBalance === 0) + 1 || totalPayments
    const extraPayoffMonth = data.findIndex((d) => d.extraBalance === 0) + 1 || totalPayments

    const standardPayoffDate = new Date(startDate)
    standardPayoffDate.setMonth(standardPayoffDate.getMonth() + standardPayoffMonth)

    const extraPayoffDate = new Date(startDate)
    extraPayoffDate.setMonth(extraPayoffDate.getMonth() + extraPayoffMonth)

    setAmortizationData(data)
    setStandardSummary({
      monthlyPayment,
      totalInterest: standardTotalInterest,
      totalPayment: loanAmount + standardTotalInterest,
      payoffDate: standardPayoffDate,
    })

    setExtraSummary({
      monthlyPayment: extraMonthlyPaymentTotal,
      totalInterest: extraTotalInterest,
      totalPayment: loanAmount + extraTotalInterest,
      payoffDate: extraPayoffDate,
      interestSaved: standardTotalInterest - extraTotalInterest,
      timeSaved: standardPayoffMonth - extraPayoffMonth,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Loan Summary</h2>
          <Button variant="outline" size="sm" onClick={onBack}>
            Edit Inputs
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Amount:</dt>
                <dd className="text-right font-medium">{formatCurrency(loanDetails.loanAmount)}</dd>
                <dt className="text-gray-500 dark:text-gray-400">Interest Rate:</dt>
                <dd className="text-right font-medium">{loanDetails.interestRate}%</dd>
                <dt className="text-gray-500 dark:text-gray-400">Term:</dt>
                <dd className="text-right font-medium">{loanDetails.loanTerm} years</dd>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Extra Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                {(extraPayments.paymentType === "monthly" || extraPayments.paymentType === "both") && (
                  <>
                    <dt className="text-gray-500 dark:text-gray-400">Monthly Extra:</dt>
                    <dd className="text-right font-medium">{formatCurrency(extraPayments.extraMonthlyAmount)}</dd>
                  </>
                )}
                {(extraPayments.paymentType === "yearly" || extraPayments.paymentType === "both") && (
                  <>
                    <dt className="text-gray-500 dark:text-gray-400">Yearly Lump Sum:</dt>
                    <dd className="text-right font-medium">{formatCurrency(extraPayments.yearlyLumpSum)}</dd>
                    <dt className="text-gray-500 dark:text-gray-400">Applied For:</dt>
                    <dd className="text-right font-medium">{extraPayments.yearsToApplyLumpSum} years</dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Your Savings with Extra Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Interest Saved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(extraSummary.interestSaved)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(extraSummary.timeSaved / 12)} years, {extraSummary.timeSaved % 12} months
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payoff Date</p>
              <p className="text-lg font-bold">{extraSummary.payoffDate.toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">vs {standardSummary.payoffDate.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Amortization Table</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="pt-4">
          <AmortizationChart data={amortizationData} />
        </TabsContent>
        <TabsContent value="table" className="pt-4">
          <AmortizationTable data={amortizationData} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onReset} className="flex-1">
          Try New Scenario
        </Button>
      </div>
    </div>
  )
}

