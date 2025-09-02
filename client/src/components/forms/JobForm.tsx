// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface JobFormValues {
//   title: string;
//   type: string;
//   location: string;
//   is_remote: boolean;
//   description: string;
//   requirements: string;
//   salary: string;
//   deadline: string;
//   skills: string[];
// }

// interface JobFormProps {
//   initialValues: JobFormValues;
//   onSubmit: (values: JobFormValues) => void;
//   submitLabel?: string;
// }

// const JobForm: React.FC<JobFormProps> = ({ initialValues, onSubmit, submitLabel = "Submit" }) => {
//   const [form, setForm] = useState(initialValues);

//   useEffect(() => {
//     setForm(initialValues); // Update form values when editing
//   }, [initialValues]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value: string) => {
//     setForm(prev => ({ ...prev, type: value }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm(prev => ({ ...prev, is_remote: e.target.checked }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (e.key === "Enter" || e.key === ",") {
//     e.preventDefault();
//     const input = e.currentTarget.value.trim();
//     if (input && !form.skills.includes(input)) {
//       setForm(prev => ({
//         ...prev,
//         skills: [...prev.skills, input],
//       }));
//       e.currentTarget.value = "";
//     }
//   }
// };

// const removeSkill = (index: number) => {
//   setForm(prev => ({
//     ...prev,
//     skills: prev.skills.filter((_, i) => i !== index),
//   }));
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="space-y-6">
//         <div>
//           <Label htmlFor="title">Job Title *</Label>
//           <Input id="title" name="title" value={form.title} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="type">Job Type *</Label>
//           <Select value={form.type} onValueChange={handleSelectChange}>
//             <SelectTrigger id="type">
//               <SelectValue placeholder="Select job type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="full-time">Full-time</SelectItem>
//               <SelectItem value="part-time">Part-time</SelectItem>
//               <SelectItem value="internship">Internship</SelectItem>
//               <SelectItem value="contract">Contract</SelectItem>
//               <SelectItem value="freelance">Freelance</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor="location">Location *</Label>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input id="location" name="location" value={form.location} onChange={handleChange} required />
//             <div className="flex items-center space-x-2">
//               <input type="checkbox" id="is_remote" checked={form.is_remote} onChange={handleCheckboxChange} className="w-4 h-4" />
//               <label htmlFor="is_remote">Remote work available</label>
//             </div>
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="description">Job Description *</Label>
//           <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="requirements">Requirements *</Label>
//           <Textarea id="requirements" name="requirements" value={form.requirements} onChange={handleChange} required />
//         </div>
//         <div>
//         <Label htmlFor="skills">Required Skills</Label>
//         <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded-md min-h-[48px]">
//           {form.skills.map((skill, index) => (
//             <span key={index} className="bg-[#F6C500] text-black px-3 py-1 rounded-full text-sm flex items-center">
//               {skill}
//               <button
//                 type="button"
//                 onClick={() => removeSkill(index)}
//                 className="ml-2 text-black font-bold hover:text-red-600"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//           <input
//             type="text"
//             id="skills"
//             placeholder="Type skill and press Enter"
//             className="flex-grow focus:outline-none px-2 py-1 text-sm"
//             onKeyDown={handleSkillKeyDown}
//           />
//         </div>
//       </div>


//         <div>
//           <Label htmlFor="salary">Salary</Label>
//           <Input id="salary" name="salary" value={form.salary} onChange={handleChange} />
//         </div>

//         <div>
//           <Label htmlFor="deadline">Application Deadline</Label>
//           <Input type="date" id="deadline" name="deadline" value={form.deadline} onChange={handleChange} />
//         </div>

//         <div className="pt-4">
//           <Button type="submit" style={{ backgroundColor: "#F6C500", color: "#000000" }} className="w-full">
//             {submitLabel}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default JobForm;



import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFormValues {
  title: string;
  type: string;
  location: string;
  is_remote: boolean;
  description: string;
  requirements: string;
  salary: string;
  deadline: string;
  skills: string[];
}

interface JobFormProps {
  initialValues: JobFormValues;
  onSubmit: (values: JobFormValues) => void;
  submitLabel?: string;
}

const JobForm: React.FC<JobFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const [form, setForm] = useState<JobFormValues>({
    ...initialValues,
    skills: initialValues.skills ?? [],
  });

  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    setForm({
      ...initialValues,
      skills: initialValues.skills ?? [],
    });
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, is_remote: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = currentSkill.trim();
      if (
        trimmed &&
        !form.skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())
      ) {
        setForm((prev) => ({
          ...prev,
          skills: [...prev.skills, trimmed],
        }));
      }
      setCurrentSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Job Type *</Label>
          <Select value={form.type} onValueChange={handleSelectChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_remote"
                checked={form.is_remote}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              <label htmlFor="is_remote">Remote work available</label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Job Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="requirements">Requirements *</Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="skills">Required Skills</Label>
          <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded-md min-h-[48px]">
            {Array.isArray(form.skills) && form.skills.length > 0 ? (
              form.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#F6C500] text-black px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-black font-bold hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic">No skills added</span>
            )}

            <input
              type="text"
              id="skills"
              placeholder="Type skill and press Enter"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="flex-grow focus:outline-none px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input
            type="date"
            id="deadline"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            style={{ backgroundColor: "#F6C500", color: "#000000" }}
            className="w-full"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default JobForm;

