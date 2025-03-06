"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

interface AmortizationTableProps {
  data: {
    month: number
    standardBalance: number
    extraBalance: number
    standardPrincipal: number
    standardInterest: number
    extraPrincipal: number
    extraInterest: number
  }[]
}

export default function AmortizationTable({ data }: AmortizationTableProps) {
  const [tableView, setTableView] = useState<"standard" | "extra">("standard")

  return (
    <div className="space-y-4">
      <Tabs value={tableView} onValueChange={(value) => setTableView(value as "standard" | "extra")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Payment</TabsTrigger>
          <TabsTrigger value="extra">With Extra Payments</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[80px]">Month</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month} className={row.month % 2 === 0 ? "bg-muted/50" : ""}>
                <TableCell>{row.month}</TableCell>
                {tableView === "standard" ? (
                  <>
                    <TableCell>{formatCurrency(row.standardPrincipal + row.standardInterest)}</TableCell>
                    <TableCell>{formatCurrency(row.standardPrincipal)}</TableCell>
                    <TableCell>{formatCurrency(row.standardInterest)}</TableCell>
                    <TableCell>{formatCurrency(row.standardBalance)}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{formatCurrency(row.extraPrincipal + row.extraInterest)}</TableCell>
                    <TableCell>{formatCurrency(row.extraPrincipal)}</TableCell>
                    <TableCell>{formatCurrency(row.extraInterest)}</TableCell>
                    <TableCell>{formatCurrency(row.extraBalance)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

