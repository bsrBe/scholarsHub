import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const statusParam = searchParams.get("status");
        const messageParam = searchParams.get("message");

        if (statusParam === "success") {
            setStatus("success");
            setMessage(messageParam || "Your email has been successfully verified.");
        } else if (statusParam === "error") {
            setStatus("error");
            setMessage(messageParam || "Failed to verify email. The link may be invalid or expired.");
        } else {
            setStatus("error");
            setMessage("Invalid verification link.");
        }
    }, [searchParams]);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full py-8 px-8 mb-8 shadow-lg border border-primary/10">
                    <CardContent className="flex flex-col items-center text-center space-y-6 pt-4">
                        {status === "loading" ? (
                            <>
                                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground">Verifying...</h2>
                                    <p className="text-muted-foreground">Please wait while we verify your email.</p>
                                </div>
                            </>
                        ) : status === "success" ? (
                            <>
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
                                    <p className="text-muted-foreground">{message}</p>
                                </div>
                                <Button asChild className="w-full h-12 text-base" size="lg">
                                    <Link to="/auth/login">Continue to Login</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
                                    <p className="text-muted-foreground">{message}</p>
                                </div>
                                <Button asChild variant="outline" className="w-full h-12 text-base" size="lg">
                                    <Link to="/auth/login">Back to Login</Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default EmailConfirmation;
