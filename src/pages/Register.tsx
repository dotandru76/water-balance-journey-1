
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  User, 
  Weight, 
  Ruler, 
  CalendarDays, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem, RadioGroupItemWithImage } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 && num < 120;
  }, {
    message: "Please enter a valid age between 1-120.",
  }),
  sex: z.enum(["male", "female", "other"], {
    required_error: "Please select your sex.",
  }),
  weight: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num < 500;
  }, {
    message: "Please enter a valid weight (20-500 kg/lbs).",
  }),
  height: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num < 300;
  }, {
    message: "Please enter a valid height (50-300 cm).",
  }),
});

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      sex: undefined,
      weight: "",
      height: "",
    },
    mode: "onChange"
  });

  const goToNextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await validateStepFields(fields);
    
    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        onSubmit(form.getValues());
      }
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: return ["name"];
      case 2: return ["sex"];
      case 3: return ["age", "weight", "height"];
      case 4: return []; // Review step, no fields to validate
      default: return [];
    }
  };

  const validateStepFields = async (fields: string[]) => {
    const result = await form.trigger(fields as any);
    return result;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("userData", JSON.stringify(values));
    
    toast.success("Profile created successfully!");
    
    navigate("/profile-complete");
  }

  const getCurrentStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col items-center space-y-8 my-6 md:my-12">
              <div className="flex flex-col items-center">
                <RightFootIcon 
                  className="text-white mb-2" 
                  size={isMobile ? 200 : 300} 
                  color="white" 
                />
                <h2 className="text-lg md:text-xl font-medium text-white mt-4">You are taking the Right Step</h2>
              </div>
            </div>
            <CardContent className="pt-4 md:pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <User className="h-4 w-4" /> Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} className="bg-white/10 border-white/20 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <div className="flex justify-center mb-4 md:mb-6">
              <RightFootIcon className="h-16 w-16 md:h-20 md:w-20 text-white" size={isMobile ? 64 : 80} />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-white">Hi, {form.getValues().name}!</CardTitle>
            <CardDescription className="text-center mb-3 md:mb-4 text-white/80">
              Please select your gender to personalize your plan
            </CardDescription>
            <CardContent className="pt-4 md:pt-6 space-y-5 md:space-y-6">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-3 md:space-x-6"
                      >
                        <RadioGroupItemWithImage 
                          id="male"
                          value="male"
                          imageSrc="/lovable-uploads/64afc05e-9201-4769-b2d3-d44c83480d8a.png"
                          label="Male"
                        />
                        
                        <RadioGroupItemWithImage
                          id="female"
                          value="female"
                          imageSrc="/lovable-uploads/85d23c27-0326-452e-9dae-f3a6b94f05d5.png"
                          label="Female"
                        />
                        
                        <RadioGroupItemWithImage
                          id="other"
                          value="other"
                          imageSrc="/lovable-uploads/6ca3238a-5a6d-46e7-85f0-9dddd40f73b3.png"
                          label="Other"
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-center text-white" />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <div className="flex justify-center mb-4 md:mb-6">
              <RightFootIcon className="h-16 w-16 md:h-20 md:w-20 text-rightstep-green" size={isMobile ? 64 : 80} />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-rightstep-green">Almost there!</CardTitle>
            <CardDescription className="text-center mb-3 md:mb-4">
              Let's finish up with some measurements to personalize your journey.
            </CardDescription>
            <CardContent className="pt-4 md:pt-6 space-y-5 md:space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" /> Your Age
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Weight className="h-4 w-4" /> Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your height" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <div className="flex justify-center mb-4 md:mb-6">
              <RightFootIcon className="h-16 w-16 md:h-20 md:w-20 text-rightstep-green" size={isMobile ? 64 : 80} />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-rightstep-green">Ready to Start Your Journey</CardTitle>
            <CardDescription className="text-center mb-3 md:mb-4">
              Here's a summary of your information. Everything looks good?
            </CardDescription>
            <CardContent className="pt-4 md:pt-6">
              <div className="space-y-4">
                <div className="border rounded-md p-3 md:p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{form.getValues().name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{form.getValues().sex}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{form.getValues().age} years</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{form.getValues().weight} kg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">{form.getValues().height} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rightstep-vertical-gradient py-4 md:py-8">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-md">
        <Form {...form}>
          <Card className={cn(
            "w-full shadow-lg border-0",
            step === 1 || step === 2 ? "bg-transparent shadow-none" : "bg-white"
          )}>
            <CardHeader className={cn(
              "text-center",
              step === 1 || step === 2 ? "text-white" : "",
              "px-4 md:px-6 py-4 md:py-6"
            )}>
              {getCurrentStepContent()}
            </CardHeader>
            <CardFooter className="flex flex-col gap-3 pb-6">
              <div className="flex w-full gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={goToPreviousStep} className={cn(
                    "flex-1",
                    step === 2 ? "border-white/30 text-white hover:bg-white/10" : "border-gray-300"
                  )}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                <Button 
                  onClick={goToNextStep} 
                  className={`${step === 1 ? 'w-full' : 'flex-1'} bg-rightstep-green hover:bg-rightstep-green-dark rounded-full py-5 md:py-6`}
                >
                  {step === 1 ? 'Get Started' : (step < totalSteps ? 'Next Step' : 'Complete')}
                  {step < totalSteps && step !== 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <p className={cn(
                "text-xs text-center",
                step === 1 || step === 2 ? "text-white/70" : "text-gray-500"
              )}>
                Your data is stored locally on your device
              </p>
            </CardFooter>
          </Card>
        </Form>
      </div>
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 md:h-2 w-1.5 md:w-2 rounded-full",
                i === 0 ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
