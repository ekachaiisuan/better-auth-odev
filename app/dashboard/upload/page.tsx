"use client";

import { useState } from "react";
import { processPdfFile } from "@/server/upload";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PDFUpload() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "error" | "success";
        text: string;
    } | null>(null);

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const documentId = formData.get("documentId") as string;
        const file = formData.get("pdf") as File;

        if (!file) {
            setMessage({
                type: "error",
                text: "กรุณาเลือกไฟล์ PDF",
            });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const uploadData = new FormData();
            uploadData.append("pdf", file);
            uploadData.append("documentId", documentId);

            const result = await processPdfFile(uploadData);

            if (result.success) {
                setMessage({
                    type: "success",
                    text: result.message || "PDF processed successfully",
                });
                form.reset();
            } else {
                setMessage({
                    type: "error",
                    text: result.error || "Failed to process PDF",
                });
            }
        } catch (err) {
            setMessage({
                type: "error",
                text: "An error occurred while processing the PDF",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleFileUpload}
            className="min-h-screen bg-gray-50 py-12 px-4"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    PDF Upload
                </h1>
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="document-id">Document Id</Label>
                                <Input
                                    id="document-id"
                                    name="documentId"
                                    type="text"
                                    placeholder="document id"
                                    disabled={isLoading}
                                    required
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pdf-upload">Upload PDF File</Label>
                                <Input
                                    id="pdf-upload"
                                    name="pdf"
                                    type="file"
                                    accept=".pdf"
                                    disabled={isLoading}
                                    required
                                    className="mt-2"
                                />
                            </div>

                            {isLoading && (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-muted-foreground">
                                        Processing PDF...
                                    </span>
                                </div>
                            )}

                            {message && (
                                <Alert
                                    variant={message.type === "error" ? "destructive" : "default"}
                                >
                                    <AlertTitle>
                                        {message.type === "error" ? "Error!" : "Success!"}
                                    </AlertTitle>
                                    <AlertDescription>{message.text}</AlertDescription>
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Upload PDF"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </form>

    );
}