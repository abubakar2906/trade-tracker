"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadCsvTrades } from "../lib/api";

export function CsvImport({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccessMsg("");
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setError("");
    setSuccessMsg("");
    setIsUploading(true);

    try {
      const result = await uploadCsvTrades(file);
      setSuccessMsg(`Successfully imported ${result.imported} trades!`);
      if (result.errors && result.errors.length > 0) {
        setError(`Warning: ${result.errors.length} rows failed to import. See console for details.`);
        console.warn("CSV Import Errors:", result.errors);
      }
      setFile(null);
      if (onImportSuccess) {
        onImportSuccess();
      }
      // Clear file input
      const fileInput = document.getElementById("csv-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mt-6 border-dashed border-2 bg-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <FileUp className="w-5 h-5 text-primary" />
          Import from CSV File
        </CardTitle>
        <CardDescription>
          Upload an exported history file from your broker (e.g. MetaTrader, cTrader).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="flex-1 cursor-pointer file:cursor-pointer"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? "Uploading..." : "Upload & Import"}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded mt-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded mt-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
