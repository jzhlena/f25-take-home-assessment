"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";

interface WeatherIdFormData {
    id: string
}

// function formatDateForDisplay(date: Date | undefined): string {
//   if (!date) return "";
//   return date.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// }

// function formatDateForAPI(date: Date | undefined): string {
//   if (!date) return "";
//   return date.toISOString().split("T")[0];
// }

// function isValidDate(date: Date | undefined): boolean {
//   return date instanceof Date && !isNaN(date.getTime());
// }

export function WeatherIdForm() {
    //   const [calendarOpen, setCalendarOpen] = useState(false);
    //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    //     new Date(),
    //   );
    //   const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    //     new Date(),
    //   );
    //   const [displayValue, setDisplayValue] = useState(
    //     formatDateForDisplay(new Date()),
    //   );

    const [formData, setFormData] = useState<WeatherIdFormData>({
        id: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        id?: string;
        data?: any;
    } | null>(null);

    //   const handleDateChange = (date: Date | undefined) => {
    //     setSelectedDate(date);  const [formData, setFormData] = useState<WeatherIdFormData>({
    //     id: ""
    //   })
    //     setDisplayValue(formatDateForDisplay(date));
    //     setFormData((prev) => ({
    //       ...prev,
    //       date: formatDateForAPI(date),
    //     }));
    //     setCalendarOpen(false);
    //   };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //   const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const inputValue = e.target.value;
    //     setDisplayValue(inputValue);

    //     const parsedDate = new Date(inputValue);
    //     if (isValidDate(parsedDate)) {
    //       setSelectedDate(parsedDate);
    //       setCalendarMonth(parsedDate);
    //       setFormData((prev) => ({
    //         ...prev,
    //         date: formatDateForAPI(parsedDate),
    //       }));
    //     }
    //   };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        try {
            const response = await fetch(`http://localhost:8000/weather/${formData.id}`, {
                method: "GET",
                headers: {
                    //   "Content-Type": "application/json",
                },
                // body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setResult({
                    success: true,
                    message: "Weather request submitted successfully!",
                    id: data.id,
                    data: data
                });
                // Reset form after successful submission
                // const today = new Date();
                // setSelectedDate(today);
                // setDisplayValue(formatDateForDisplay(today));
                setFormData({
                    id: ""
                });
            } else {
                const errorData = await response.json();
                setResult({
                    success: false,
                    message: errorData.detail || "Failed to submit weather id request",
                });
            }
        } catch {
            setResult({
                success: false,
                message: "Network error: Could not connect to the server",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Weather Data Request by ID</CardTitle>
                <CardDescription>
                    Submit a Weather Data Request from Server
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                        <Label htmlFor="id">weather id</Label>
                        <Input
                            id="id"
                            name="id"
                            type="text"
                            value={formData.id}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Weather Request"}
                    </Button>

                    {result && (
                        <div
                            className={`p-3 rounded-md ${result.success
                                    ? "bg-green-900/20 text-green-500 border border-green-500"
                                    : "bg-red-900/20 text-red-500 border border-red-500"
                                }`}
                        >
                            <p className="text-sm font-medium">{result.message}</p>
                            {result.success && result.data && (
                                <pre className="mt-2 max-h-48 overflow-auto bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap break-words">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
