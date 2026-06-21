import { SignIn } from "@clerk/nextjs";
import { AuthNotConfigured } from "@/components/auth/AuthNotConfigured";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default function SignInPage() {
  if (!clerkEnabled) return <AuthNotConfigured action="sign in" />;
  return (
    <SignIn
      appearance={{ variables: { colorPrimary: "#5b6cf0", borderRadius: "0.75rem" } }}
    />
  );
}
