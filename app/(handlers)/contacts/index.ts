// Re-export all contact-related functionality
export {
  useCreateContact,
  useGetMyContacts,
  useGetContactById,
  useUpdateContact,
  useDeleteContact,
  useSearchContacts,
  useCreatePublicContact,
  useGetPublicContacts,
  useGetPublicContactById,
  useUpdatePublicContact,
  useDeletePublicContact,
} from "./queries";

// Re-export API functions for direct use
export { contactAPI } from "./api";

// Re-export legacy functions for backward compatibility
export {
  fetchContacts,
  fetchPublicContacts,
  createContact,
  getMyContacts,
  getContactById,
  updateContact,
  deleteContact,
  searchContacts,
  createPublicContact,
  getPublicContacts,
  getPublicContactById,
  updatePublicContact,
  deletePublicContact,
} from "./contacts";
