import { SignUp } from "@clerk/nextjs";
import { AuthNotConfigured } from "@/components/auth/AuthNotConfigured";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  if (!clerkEnabled) return <AuthNotConfigured action="sign up" />;
  return (
    <SignUp
      appearance={{ variables: { colorPrimary: "#5b6cf0", borderRadius: "0.75rem" } }}
    />
  );
}
