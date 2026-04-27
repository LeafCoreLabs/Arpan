import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { MapPin, User, AlertTriangle, Users, Camera, Clock, Cloud, CheckCircle } from "lucide-react";

interface FormData {
  country: string;
  state: string;
  district: string;
  locationName: string;
  gpsLat: string;
  gpsLng: string;
  volunteerName: string;
  volunteerId: string;
  role: string;
  contactNumber: string;
  email: string;
  issueTitle: string;
  issueType: string;
  description: string;
  severity: string;
  priority: string;
  peopleAffected: string;
  ageGroup: string[];
  vulnerableGroups: string[];
  dateObserved: string;
  timeObserved: string;
  weatherConditions: string;
  accessibility: string;
  dataAccuracy: boolean;
  consent: boolean;
}

export default function DataCollectionForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const [currentTab, setCurrentTab] = useState("location");

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success("Report submitted successfully!", {
      description: "Your report has been received and will be verified soon."
    });
  };

  const tabs = [
    { value: "location", label: "Location", icon: MapPin },
    { value: "reporter", label: "Reporter", icon: User },
    { value: "issue", label: "Issue Details", icon: AlertTriangle },
    { value: "population", label: "Population", icon: Users },
    { value: "media", label: "Media", icon: Camera },
    { value: "time", label: "Time Info", icon: Clock },
    { value: "environment", label: "Environment", icon: Cloud },
    { value: "verification", label: "Verify", icon: CheckCircle },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl mb-4">Data Collection Form</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1">
                <tab.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="location" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              Location Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select onValueChange={(value) => setValue("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="nepal">Nepal</SelectItem>
                    <SelectItem value="pakistan">Pakistan</SelectItem>
                    <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="state">State / Region *</Label>
                <Select onValueChange={(value) => setValue("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district">District / Area *</Label>
                <Input {...register("district", { required: true })} placeholder="Enter district" />
              </div>

              <div>
                <Label htmlFor="locationName">Exact Location Name *</Label>
                <Input {...register("locationName", { required: true })} placeholder="Village/Town name" />
              </div>

              <div>
                <Label htmlFor="gpsLat">GPS Latitude</Label>
                <Input {...register("gpsLat")} placeholder="19.0760" type="number" step="any" />
              </div>

              <div>
                <Label htmlFor="gpsLng">GPS Longitude</Label>
                <Input {...register("gpsLng")} placeholder="72.8777" type="number" step="any" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reporter" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5" />
              Reporter / Volunteer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volunteerName">Volunteer Name *</Label>
                <Input {...register("volunteerName", { required: true })} placeholder="Full name" />
              </div>

              <div>
                <Label htmlFor="volunteerId">Volunteer ID *</Label>
                <Input {...register("volunteerId", { required: true })} placeholder="VOL-12345" />
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={(value) => setValue("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="field-officer">Field Officer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input {...register("contactNumber", { required: true })} placeholder="+91 98765 43210" type="tel" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} placeholder="volunteer@ngo.org" type="email" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issue" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              Issue / Case Details
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="issueTitle">Issue Title *</Label>
                <Input {...register("issueTitle", { required: true })} placeholder="Brief title of the issue" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueType">Issue Type *</Label>
                  <Select onValueChange={(value) => setValue("issueType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food-shortage">Food Shortage</SelectItem>
                      <SelectItem value="medical-emergency">Medical Emergency</SelectItem>
                      <SelectItem value="shelter-need">Shelter Need</SelectItem>
                      <SelectItem value="education">Education Issue</SelectItem>
                      <SelectItem value="water-sanitation">Water & Sanitation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select onValueChange={(value) => setValue("severity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  {...register("description", { required: true })}
                  placeholder="Provide detailed description of the issue..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select onValueChange={(value) => setValue("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-calculated based on severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">P1 - Immediate</SelectItem>
                    <SelectItem value="p2">P2 - Urgent (24-48hrs)</SelectItem>
                    <SelectItem value="p3">P3 - High (1 week)</SelectItem>
                    <SelectItem value="p4">P4 - Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="population" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              Affected Population
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="peopleAffected">Number of People Affected *</Label>
                <Input {...register("peopleAffected", { required: true })} placeholder="Estimated count" type="number" />
              </div>

              <div>
                <Label>Age Group Distribution</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("ageGroup")} value="children" />
                    <span>Children (0-17 years)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("ageGroup")} value="adults" />
                    <span>Adults (18-59 years)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("ageGroup")} value="elderly" />
                    <span>Elderly (60+ years)</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>Vulnerable Groups</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("vulnerableGroups")} value="disabled" />
                    <span>Disabled</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("vulnerableGroups")} value="pregnant" />
                    <span>Pregnant Women</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("vulnerableGroups")} value="elderly-vulnerable" />
                    <span>Elderly (requiring special care)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox {...register("vulnerableGroups")} value="chronic-illness" />
                    <span>Chronic Illness</span>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5" />
              Evidence / Media Upload
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <Input type="file" accept="image/*" multiple className="cursor-pointer" />
                <p className="text-xs text-muted-foreground mt-1">Support: JPG, PNG (Max 5MB each)</p>
              </div>

              <div>
                <Label htmlFor="videos">Upload Videos</Label>
                <Input type="file" accept="video/*" multiple className="cursor-pointer" />
                <p className="text-xs text-muted-foreground mt-1">Support: MP4, MOV (Max 50MB each)</p>
              </div>

              <div>
                <Label htmlFor="documents">Upload Documents</Label>
                <Input type="file" accept=".pdf,.doc,.docx" multiple className="cursor-pointer" />
                <p className="text-xs text-muted-foreground mt-1">Support: PDF, DOC, DOCX</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              Time Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateObserved">Date of Observation *</Label>
                <Input {...register("dateObserved", { required: true })} type="date" />
              </div>

              <div>
                <Label htmlFor="timeObserved">Time of Observation *</Label>
                <Input {...register("timeObserved", { required: true })} type="time" />
              </div>

              <div className="md:col-span-2">
                <Label>Report Submission Time</Label>
                <Input value={new Date().toLocaleString()} disabled className="bg-muted" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5" />
              Environment / Conditions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Select onValueChange={(value) => setValue("weatherConditions", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="extreme-heat">Extreme Heat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accessibility">Accessibility Status</Label>
                <Select onValueChange={(value) => setValue("accessibility", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accessibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy Access</SelectItem>
                    <SelectItem value="difficult">Difficult Access</SelectItem>
                    <SelectItem value="critical">Critical - Emergency Access Needed</SelectItem>
                    <SelectItem value="blocked">Road Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <h3 className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" />
              Verification & Consent
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox {...register("dataAccuracy", { required: true })} className="mt-1" />
                <div>
                  <p className="text-sm">Data Accuracy Confirmation *</p>
                  <p className="text-xs text-muted-foreground">I confirm that all information provided is accurate to the best of my knowledge</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox {...register("consent", { required: true })} className="mt-1" />
                <div>
                  <p className="text-sm">Consent to Use Data *</p>
                  <p className="text-xs text-muted-foreground">I consent to the use of this data for humanitarian purposes and reporting</p>
                </div>
              </label>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-blue-900">
                  All required fields must be completed before submission. Your report will be reviewed by a field manager within 24 hours.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.value === currentTab);
              if (currentIndex > 0) {
                setCurrentTab(tabs[currentIndex - 1].value);
              }
            }}
            disabled={currentTab === "location"}
          >
            Previous
          </Button>

          {currentTab === "verification" ? (
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Submit Report
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.value === currentTab);
                if (currentIndex < tabs.length - 1) {
                  setCurrentTab(tabs[currentIndex + 1].value);
                }
              }}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
