/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Contact } from "@/constants/types";
import { ContactSelection } from "./contact-selection";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface ContactSelectionMainProps {
  email: string;
  onContactSelected: (contact: Contact) => void;
  onNewContactAdded: (contact: Contact) => void;
  contactManually: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    sub_contact_phone: string;
    sub_contact_email: string;
  };
  setContactManually: Dispatch<
    SetStateAction<{
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      sub_contact_phone: string;
      sub_contact_email: string;
    }>
  >;
}

const ContactSelectionMain = ({
  email,
  onContactSelected,
  onNewContactAdded,
  contactManually,
  setContactManually
}: ContactSelectionMainProps) => {
  const { user, isLoading: isUserLoading } = useFetchUser();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Manual contact form state (for guests or custom mode)

  const handleContactSelected = (contact: Contact) => {
    setSelectedContact(contact);
    onContactSelected(contact);
  };

  const handleNewContactAdded = (contact: Contact) => {
    setSelectedContact(contact);
    onNewContactAdded(contact);
  };

  // For guests, no contact selection panel; keep manual contact form
  const handleEmailChange = (newEmail: string) => {
    if (!user) {
      setSelectedContact(null);
    }
  };

  // Update email when it changes
  useEffect(() => {
    handleEmailChange(email);
  }, [email, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          <h2 className="text-xl font-semibold text-gray-800">
            Contact Information
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading State */}
        {isUserLoading && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        )}

        {/* Case 1: Logged-in user choosing from saved contacts */}
        {user && !isUserLoading && (
          <ContactSelection
            email={(user as any).Email}
            isAuthenticated={true}
            onContactSelected={handleContactSelected}
            onNewContactAdded={handleNewContactAdded}
          />
        )}

        {/* Case 2: Guest user with email - show public contact selection */}
        {!user && !isUserLoading && email && (
          <ContactSelection
            email={email}
            isAuthenticated={false}
            onContactSelected={handleContactSelected}
            onNewContactAdded={handleNewContactAdded}
          />
        )}

        {/* Case 3: Manual contact form (guest without email or custom mode) */}
        {!user && !isUserLoading && !email && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={contactManually.first_name}
                  onChange={(e) =>
                    setContactManually({
                      ...contactManually,
                      first_name: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={contactManually.last_name}
                  onChange={(e) =>
                    setContactManually({
                      ...contactManually,
                      last_name: e.target.value
                    })
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
                value={contactManually.email}
                onChange={(e) =>
                  setContactManually({
                    ...contactManually,
                    email: e.target.value
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="+234 801 234 5678"
                value={contactManually.phone}
                onChange={(e) =>
                  setContactManually({
                    ...contactManually,
                    phone: e.target.value
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subContactPhone">Alternative Phone</Label>
                <Input
                  id="subContactPhone"
                  placeholder="+234 801 234 5679"
                  value={contactManually.sub_contact_phone}
                  onChange={(e) =>
                    setContactManually({
                      ...contactManually,
                      sub_contact_phone: e.target.value
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
                  value={contactManually.sub_contact_email}
                  onChange={(e) =>
                    setContactManually({
                      ...contactManually,
                      sub_contact_email: e.target.value
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Contact Display */}
        {selectedContact && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">Selected Contact:</h4>
            <p className="text-sm text-green-700">
              {selectedContact.FirstName} {selectedContact.LastName}
            </p>
            <p className="text-sm text-green-700">{selectedContact.Email}</p>
            <p className="text-sm text-green-700">{selectedContact.Phone}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSelectionMain;
