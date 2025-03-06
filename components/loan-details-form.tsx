"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LoanDetails } from "./loan-simulator";

const formSchema = z.object({
  loanAmount: z.coerce
    .number()
    .positive("Loan amount must be positive")
    .min(1, "Loan amount is required"),
  interestRate: z.coerce
    .number()
    .positive("Interest rate must be positive")
    .max(100, "Interest rate cannot exceed 100%"),
  loanTerm: z.coerce
    .number()
    .int("Loan term must be a whole number")
    .positive("Loan term must be positive"),
  startDate: z.date(),
});

interface LoanDetailsFormProps {
  onSubmit: (data: LoanDetails) => void;
  initialData: LoanDetails;
}

export default function LoanDetailsForm({
  onSubmit,
  initialData,
}: LoanDetailsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: initialData.loanAmount || 0,
      interestRate: initialData.interestRate || 0,
      loanTerm: initialData.loanTerm || 0,
      startDate: initialData.startDate || new Date(),
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    &#8377;
                  </span>
                  <Input
                    placeholder="Enter loan amount"
                    className="pl-7"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interestRate"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Annual Interest Rate</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Enter your annual interest rate as a percentage (e.g., 5
                        for 5%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter interest rate"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loanTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term (Years)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter loan term"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date your loan begins</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Calculate Amortization
        </Button>
      </form>
    </Form>
  );
}
