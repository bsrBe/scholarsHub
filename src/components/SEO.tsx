import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
}

const SEO = ({
    title = "Scholarshub Global | Scholarships, Education, Study Abroad",
    description = "Scholarshub Global helps students secure international scholarships, study abroad opportunities, and education consulting services worldwide.",
    url = "https://scholarshubglobal.com/",
    image = "https://scholarshubglobal.com/og-logo.png"
}: SEOProps) => {
    useEffect(() => {
        // Update Title
        document.title = title;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', title);

        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', description);

        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (!ogUrl) {
            ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            document.head.appendChild(ogUrl);
        }
        ogUrl.setAttribute('content', url);

        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', image);

        // Update Twitter tags
        let twitterCard = document.querySelector('meta[name="twitter:card"]');
        if (!twitterCard) {
            twitterCard = document.createElement('meta');
            twitterCard.setAttribute('name', 'twitter:card');
            document.head.appendChild(twitterCard);
        }
        twitterCard.setAttribute('content', 'summary_large_image');

        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (!twitterTitle) {
            twitterTitle = document.createElement('meta');
            twitterTitle.setAttribute('name', 'twitter:title');
            document.head.appendChild(twitterTitle);
        }
        twitterTitle.setAttribute('content', title);

        let twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (!twitterDescription) {
            twitterDescription = document.createElement('meta');
            twitterDescription.setAttribute('name', 'twitter:description');
            document.head.appendChild(twitterDescription);
        }
        twitterDescription.setAttribute('content', description);

        let twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImage) {
            twitterImage = document.createElement('meta');
            twitterImage.setAttribute('name', 'twitter:image');
            document.head.appendChild(twitterImage);
        }
        twitterImage.setAttribute('content', image);

        // Inject JSON-LD
        let script = document.getElementById('seo-json-ld') as HTMLScriptElement;
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'seo-json-ld';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Scholarshub Global",
            "url": "https://scholarshubglobal.com/",
            "logo": "https://scholarshubglobal.com/og-logo.png",
            "sameAs": [
                "https://www.instagram.com/scholarshubglobal",
                "https://t.me/scholars_hub_et"
            ]
        });

        return () => {
            const oldScript = document.getElementById('seo-json-ld');
            if (oldScript) document.head.removeChild(oldScript);
        };
    }, [title, description, url, image]);

    return null;
};

export default SEO;
