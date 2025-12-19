import React from 'react';

const TermsOfService = () => {
    return (
        <main className="min-h-screen bg-muted/30">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
                    <p className="text-xl text-muted-foreground">Standard terms for using our platform</p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border/50">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Agreement to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing or using scholarshubglobal.com, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the website.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Use of Services</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Our services include scholarship consulting, study abroad guidance, and application support. You agree to use these services only for lawful purposes and in a way that does not infringe the rights of others.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">3. User Accounts</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so may result unsatisfactory results on your application.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Intellectual Property</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The website and its original content, features, and functionality are and will remain the exclusive property of ScholarsHubGlobal and its licensors.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall ScholarsHub Global, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the website or services.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Changes to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                <span className="font-bold text-foreground">contact@scholarshubglobal.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TermsOfService;
