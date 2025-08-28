// src/features/jobs/JobForm.tsx
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IJob } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Updated the schema to include an optional CTC
const formSchema = z.object({
  role: z.string().min(1, { message: "Role is required." }),
  company: z.string().min(1, { message: "Company is required." }),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
  ctc: z.string().optional(),
});

type FormValues = {
  role: string;
  company: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  ctc?: string;
};

interface JobFormProps {
  job?: IJob;
  onSubmit: (data: Omit<FormValues, 'ctc'> & { ctc?: number }) => void;
  isSubmitting: boolean;
}

const JobForm = ({ job, onSubmit, isSubmitting }: JobFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: job?.role || "",
      company: job?.company || "",
      status: job?.status || "Applied",
      ctc: job?.ctc?.toString() || undefined,
    },
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{job ? "Edit Job" : "Add New Job"}</DialogTitle>
        <DialogDescription>
          {job
            ? "Update the details of your job application."
            : "Track a new job application."}
        </DialogDescription>
      </DialogHeader>
      <form id="job-form" onSubmit={handleSubmit((data) => {
                 const transformedData = {
           ...data,
           ctc: data.ctc ? parseFloat(data.ctc) : undefined
         };
        onSubmit(transformedData);
      })}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input id="role" {...register("role")} className="col-span-3" />
            {errors.role && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.role.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              {...register("company")}
              className="col-span-3"
            />
            {errors.company && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.company.message}
              </p>
            )}
          </div>
          {/* New CTC Input Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ctc" className="text-right">
              CTC (LPA)
            </Label>
                         <Input
               id="ctc"
               type="number"
               step="0.1"
               min="0"
               {...register("ctc")}
               className="col-span-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
               placeholder="e.g., 12.5"
             />
            {errors.ctc && (
              <p className="col-span-4 text-red-500 text-sm">
                {errors.ctc.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </form>
      <DialogFooter>
        <Button form="job-form" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default JobForm;
