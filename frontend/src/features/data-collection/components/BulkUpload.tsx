import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react";

export default function BulkUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="w-5 h-5" />
        <h2 className="text-xl">Bulk Data Upload</h2>
      </div>

      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-primary/10" : "border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2">Drag and drop your CSV or Excel file here</p>
          <p className="text-sm text-muted-foreground mb-4">or</p>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button type="button" onClick={() => document.getElementById("file-upload")?.click()}>
              Browse Files
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-muted-foreground mt-4">Supported formats: CSV, Excel (.xlsx, .xls)</p>
        </div>

        {uploadedFile && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">File uploaded successfully</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Process Upload
              </Button>
              <Button size="sm" variant="outline" onClick={() => setUploadedFile(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm mb-3">Import from External Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Google Sheets
            </Button>
            <Button variant="outline" className="justify-start">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Google Forms
            </Button>
            <Button variant="outline" className="justify-start">
              <Upload className="w-4 h-4 mr-2" />
              API Integration
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm mb-3">Download Template</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Use our standardized template to ensure data compatibility
          </p>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900">
                <strong>Upload Guidelines:</strong>
              </p>
              <ul className="text-xs text-primary mt-2 space-y-1 list-disc list-inside">
                <li>Ensure all required fields are filled (Country, State, Issue Type, Severity)</li>
                <li>Use ISO date format: YYYY-MM-DD</li>
                <li>GPS coordinates should be in decimal format</li>
                <li>Maximum 1000 records per upload</li>
                <li>Duplicate entries will be flagged during processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
