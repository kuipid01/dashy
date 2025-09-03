/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Contact } from "@/constants/types";
import { useGetMyContacts, useCreateContact } from "@/app/(handlers)/contacts";
import {
  useGetPublicContacts,
  useCreatePublicContact
} from "@/app/(handlers)/contacts";

interface ContactSelectionProps {
  email: string;
  isAuthenticated: boolean;
  onContactSelected: (contact: Contact) => void;
  onNewContactAdded: (contact: Contact) => void;
}

export const ContactSelection = ({
  email,
  isAuthenticated,
  onContactSelected,
  onNewContactAdded
}: ContactSelectionProps) => {
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [hasLoadedContacts, setHasLoadedContacts] = useState(false);

  // New contact form state
  const [newContact, setNewContact] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    SubContactPhone: "",
    SubContactEmail: ""
  });

  // Hooks for authenticated users
  const { data: myContacts, isLoading: isLoadingMyContacts } =
    useGetMyContacts(isAuthenticated);
  const { mutateAsync: createContact } = useCreateContact();

  // Hooks for public users
  const { data: publicContacts, isLoading: isLoadingPublicContacts } =
    useGetPublicContacts(email, !isAuthenticated && !!email);
  const { mutateAsync: createPublicContact } = useCreatePublicContact();

  const loadUserContacts = useCallback(async () => {
    if (hasLoadedContacts) return;

    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // For authenticated users, contacts are loaded via React Query
        if (myContacts) {
          setContacts(myContacts);
        }
      } else {
        // For public users, contacts are loaded via React Query
        if (publicContacts) {
          setContacts(publicContacts);
        }
      }
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setIsLoading(false);
      setHasLoadedContacts(true);
    }
  }, [isAuthenticated, myContacts, publicContacts, hasLoadedContacts]);

  const handleAddNewContact = async () => {
    if (
      !newContact.FirstName ||
      !newContact.LastName ||
      !newContact.Email ||
      !newContact.Phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      let addedContact: Contact;

      if (isAuthenticated) {
        // Create contact for authenticated user
        addedContact = await createContact({
          FirstName: newContact.FirstName,
          LastName: newContact.LastName,
          Email: newContact.Email,
          Phone: newContact.Phone,
          SubContactPhone: newContact.SubContactPhone || undefined,
          SubContactEmail: newContact.SubContactEmail || undefined
        });
      } else {
        // Create public contact
        addedContact = await createPublicContact({
          FirstName: newContact.FirstName,
          LastName: newContact.LastName,
          Email: newContact.Email,
          Phone: newContact.Phone,
          SubContactPhone: newContact.SubContactPhone || undefined,
          SubContactEmail: newContact.SubContactEmail || undefined,
          user_email: email
        });
      }

      setContacts((prev: Contact[]) => [...prev, addedContact]);
      setSelectedContactId(addedContact.ID);
      onNewContactAdded(addedContact);
      setShowNewContactForm(false);
      toast.success("Contact added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    const selectedContact = contacts.find(
      (contact: Contact) => contact.ID === contactId
    );
    if (selectedContact) {
      onContactSelected(selectedContact);
    }
  };

  // Load contacts when component mounts or when data changes
  useEffect(() => {
    loadUserContacts();
  }, [loadUserContacts]);

  // Update contacts when React Query data changes
  useEffect(() => {
    if (isAuthenticated && myContacts) {
      setContacts(myContacts);
    } else if (!isAuthenticated && publicContacts) {
      setContacts(publicContacts);
    }
  }, [isAuthenticated, myContacts, publicContacts]);

  const isLoadingContacts =
    isLoading || isLoadingMyContacts || isLoadingPublicContacts;

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoadingContacts && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Loading your contacts...</p>
        </div>
      )}

      {/* Existing Contacts */}
      {!isLoadingContacts && contacts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Choose from your saved contacts
          </h3>
          <RadioGroup
            value={selectedContactId}
            onValueChange={handleContactSelect}
            className="space-y-3"
          >
            {contacts.map((contact: Contact) => (
              <div
                key={contact.ID}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={contact.ID} id={contact.ID} />
                <Label htmlFor={contact.ID} className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {contact.FirstName} {contact.LastName}
                    </p>
                    <p className="text-sm text-gray-600">{contact.Email}</p>
                    <p className="text-sm text-gray-600">{contact.Phone}</p>
                    {contact.SubContactPhone && (
                      <p className="text-sm text-gray-500">
                        Alt Phone: {contact.SubContactPhone}
                      </p>
                    )}
                    {contact.SubContactEmail && (
                      <p className="text-sm text-gray-500">
                        Alt Email: {contact.SubContactEmail}
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* No Contacts Message */}
      {!isLoadingContacts && contacts.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-4">No saved contacts found</p>
        </div>
      )}

      {/* Add New Contact Button */}
      {!showNewContactForm && (
        <Button
          variant="outline"
          onClick={() => setShowNewContactForm(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Contact
        </Button>
      )}

      {/* New Contact Form */}
      {showNewContactForm && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Add New Contact
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={newContact.FirstName}
                  onChange={(e) =>
                    setNewContact({ ...newContact, FirstName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={newContact.LastName}
                  onChange={(e) =>
                    setNewContact({ ...newContact, LastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newContact.Email}
                onChange={(e) =>
                  setNewContact({ ...newContact, Email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="+234 801 234 5678"
                value={newContact.Phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, Phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subContactPhone">Alternative Phone</Label>
                <Input
                  id="subContactPhone"
                  placeholder="+234 801 234 5679"
                  value={newContact.SubContactPhone}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      SubContactPhone: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="subContactEmail">Alternative Email</Label>
                <Input
                  id="subContactEmail"
                  type="email"
                  placeholder="john.alt@example.com"
                  value={newContact.SubContactEmail}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      SubContactEmail: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddNewContact}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Adding..." : "Add Contact"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewContactForm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
