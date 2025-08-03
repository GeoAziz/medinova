'use client';

import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

export default function RadiologistUploadPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Upload Imaging Results"
        description="Add new scans to the system and assign them to patients."
      />
      <div>
        <GlowingCard>
          <CardHeader>
            <CardTitle>New Scan Details</CardTitle>
            <CardDescription>Fill out the form to upload and process new imaging data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID or Name</Label>
                <Input id="patientId" placeholder="e.g., PID-001 or Alex Ryder" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scanType">Imaging Type</Label>
                <Select>
                  <SelectTrigger id="scanType">
                    <SelectValue placeholder="Select scan type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xray">X-Ray</SelectItem>
                    <SelectItem value="mri">MRI</SelectItem>
                    <SelectItem value="ct">CT Scan</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="scanFile">Scan File</Label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="scanFile" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">DICOM, JPG, PNG (MAX. 50MB)</p>
                        </div>
                        <Input id="scanFile" type="file" className="hidden" />
                    </label>
                </div> 
            </div>
             <div className="space-y-2">
                <Label htmlFor="notes">Notes / Comments</Label>
                <Textarea id="notes" placeholder="Add any relevant notes about the scan or patient..." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="assignDoctor">Assign to Doctor for Review</Label>
                <Select>
                  <SelectTrigger id="assignDoctor">
                    <SelectValue placeholder="Select a doctor..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-reed">Dr. Evelyn Reed</SelectItem>
                    <SelectItem value="dr-tanaka">Dr. Kenji Tanaka</SelectItem>
                    <SelectItem value="dr-sharma">Dr. Anya Sharma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="flex justify-end">
                <Button>Upload and Process Scan</Button>
            </div>
          </CardContent>
        </GlowingCard>
      </div>
    </div>
  );
}
