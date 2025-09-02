// src/utils/formatters.ts

export const formatText = (text?: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A";
};

export const formatStatus = (status?: string) => {
  if (!status) return "Unknown";

  switch (status.toLowerCase()) {
    case "active":
    case "approved":
      return "Active";
    case "pending":
      return "Pending";
    case "rejected":
    case "inactive":
      return "Inactive";
    case "expired":
      return "Expired";
    default:
      return formatText(status);
  }
};


export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};
