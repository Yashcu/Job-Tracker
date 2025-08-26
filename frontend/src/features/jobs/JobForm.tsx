// src/features/jobs/JobForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IJob } from '../../types/job';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

// Add Select to your project if you haven't: npx shadcn-ui@latest add select

const formSchema = z.object({
  role: z.string().min(1, { message: 'Role is required.' }),
  company: z.string().min(1, { message: 'Company is required.' }),
  status: z.enum(['Applied', 'Interview', 'Offer', 'Rejected']),
});

type FormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  job?: IJob; // Optional job prop for editing
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

const JobForm = ({ job, onSubmit, isSubmitting }: JobFormProps) => {
  const {
    register,
    handleSubmit,
    control, // from react-hook-form for controlled components
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: job?.role || '',
      company: job?.company || '',
      status: job?.status || 'Applied',
    },
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{job ? 'Edit Job' : 'Add New Job'}</DialogTitle>
        <DialogDescription>
          {job ? 'Update the details of your job application.' : 'Track a new job application.'}
        </DialogDescription>
      </DialogHeader>
      <form id="job-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Role</Label>
            <Input id="role" {...register('role')} className="col-span-3" />
            {errors.role && <p className="col-span-4 text-red-500 text-sm">{errors.role.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Company</Label>
            <Input id="company" {...register('company')} className="col-span-3" />
            {errors.company && <p className="col-span-4 text-red-500 text-sm">{errors.company.message}</p>}
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
             {/* Note: shadcn's Select works best as a controlled component */}
             <Controller
                name="status"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default JobForm;