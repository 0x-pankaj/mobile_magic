
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";



export function Appbar() {
    return (
        <div className="flex justify-between">
            <div>
                Bolty
            </div>
           <div>
            <SignedOut>
                <SignInButton />
                <SignUpButton />

            </SignedOut>

            <SignedIn >
                <UserButton />
            </SignedIn>
           </div>
        </div>
    );  
}