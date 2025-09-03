import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '@/components/resume-templates';
import axios from "axios";
import { API_BASE } from '../config';




// Generate a PDF from a HTML element
export const generatePDF = async (
  elementId: string,
  fileName: string = 'resume.pdf',
  returnBlob: boolean = false
): Promise<Blob | void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found.`);
    }

    // Clone setup
    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'temp-pdf-element';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.zIndex = '-1000';
    clone.style.margin = '0';
    clone.style.padding = '20px';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = 'white';
    clone.style.overflow = 'hidden';
    clone.style.transition = 'none';
    clone.style.animation = 'none';

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: true,
      windowWidth: 794,
      windowHeight: 1123,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('temp-pdf-element');
        if (clonedElement) {
          clonedElement.style.display = 'flex';
          clonedElement.style.flexDirection = 'column';
        }
      }
    });

    document.body.removeChild(clone);

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    if (imgHeight > pageHeight) {
      let remainingHeight = imgHeight;
      let position = -pageHeight;
      while (remainingHeight > pageHeight) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        position -= pageHeight;
      }
    }

    if (returnBlob) {
      const blob = await pdf.output('blob');
      return blob;
    } else {
      pdf.save(fileName);
      return;
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};



// Initial empty resume data
export const emptyResumeData: ResumeData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedIn: '',
  summary: '',
  education: [
    {
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      relevantCourses: '',
      achievements: '',
    },
  ],
  experience: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  skills: [
    { name: '' },
    { name: '' },
    { name: '' },
  ],
  certifications: [
    {
      name: '',
      issuer: '',
      date: '',
    }
  ],
};

// Local storage helpers
export const RESUME_STORAGE_KEY = 'jobhive_resume_data';
export const TEMPLATE_STORAGE_KEY = 'jobhive_resume_template';

export const saveResumeData = async (data: Partial<ResumeData>): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    await axios.patch(
      `${API_BASE}/api/resume`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Optionally update localStorage too for faster preview
    const existingData = JSON.parse(localStorage.getItem("jobhive_resume_data") || "{}");
    const mergedData = { ...existingData, ...data };
    localStorage.setItem("jobhive_resume_data", JSON.stringify(mergedData));

  } catch (error) {
    console.error("Failed to save resume to backend:", error);
    throw error;
  }
};

export const getResumeData = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${API_BASE}/api/resume`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    console.log("Sending token:", token);

    if (res.status === 404) {
      console.warn("No resume found for user.");
      return null;
    }

    if (!res.ok) {
      const err = await res.json();
      console.error("Resume fetch error:", err);
      throw new Error("Failed to fetch resume");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Resume fetch exception:", err);
    return null; // Fallback: still return null instead of crashing the apply flow
  }
};








export const saveTemplateChoice = (templateId: string): void => {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, templateId);
};

export const getTemplateChoice = (): string => {
  return localStorage.getItem(TEMPLATE_STORAGE_KEY) || 'modern';
};