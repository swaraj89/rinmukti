"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExtraPayments } from "./loan-simulator";

const formSchema = z.object({
  paymentType: z.enum(["monthly", "yearly", "both"], {
    required_error: "Please select a payment strategy",
  }),
  extraMonthlyAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  yearlyLumpSum: z.coerce.number().min(0, "Amount cannot be negative"),
  yearsToApplyLumpSum: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Must be at least 1 year"),
});

interface ExtraPaymentOptionsProps {
  onSubmit: (data: ExtraPayments) => void;
  onBack: () => void;
  initialData: ExtraPayments;
}

export default function ExtraPaymentOptions({
  onSubmit,
  onBack,
  initialData,
}: ExtraPaymentOptionsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentType: initialData.paymentType,
      extraMonthlyAmount: initialData.extraMonthlyAmount,
      yearlyLumpSum: initialData.yearlyLumpSum,
      yearsToApplyLumpSum: initialData.yearsToApplyLumpSum,
    },
  });

  const paymentType = form.watch("paymentType");

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">
            Customize Your Payment Strategy
          </h2>
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="monthly" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Extra Monthly Payment Only
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yearly" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yearly Lump Sum Payment Only
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="both" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Both Extra Monthly & Lump Sum Payments
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {(paymentType === "monthly" || paymentType === "both") && (
          <FormField
            control={form.control}
            name="extraMonthlyAmount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Extra Monthly Payment Amount</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Additional amount you'll pay each month on top of your
                          regular payment
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      &#8377;
                    </span>
                    <Input
                      placeholder="Enter amount"
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
        )}

        {(paymentType === "yearly" || paymentType === "both") && (
          <>
            <FormField
              control={form.control}
              name="yearlyLumpSum"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Yearly Lump Sum Amount</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Additional amount you'll pay once per year
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        &#8377;
                      </span>
                      <Input
                        placeholder="Enter amount"
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
              name="yearsToApplyLumpSum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Years to Apply</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of years"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    How many years you'll make the lump sum payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
