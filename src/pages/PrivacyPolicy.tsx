import React from 'react';

const PrivacyPolicy = () => {
    return (
        <main className="min-h-screen bg-muted/30">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Last Updated: December 19, 2025</p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border/50">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                ScholarsHub Global ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website scholarshubglobal.com.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                                <li>Register on the site</li>
                                <li>Submit a scholarship application or task application</li>
                                <li>Book a consultation</li>
                                <li>Contact us via our contact form</li>
                                <li>Subscribe to our newsletter</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed">This information may include your name, email address, phone number, educational background, and any documents you upload.</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">3. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                                <li>Provide our services to you (user)</li>
                                <li>Process your applications</li>
                                <li>Communicating with you regarding your applications or inquiries</li>
                                <li>Improve our website and user experience</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement a variety of security measures to maintain the safety of your personal information, including encrypting your data and storing it in secure servers.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
