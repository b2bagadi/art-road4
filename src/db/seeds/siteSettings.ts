import { db } from '@/db';
import { siteSettings } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleSettings = [
        {
            key: 'company_email',
            value: 'info@artroad.ae',
            description: 'Company contact email',
            updatedAt: currentTimestamp,
        },
        {
            key: 'company_phone',
            value: '+971 4 123 4567',
            description: 'Company phone number',
            updatedAt: currentTimestamp,
        },
        {
            key: 'whatsapp_number',
            value: '+971501234567',
            description: 'WhatsApp contact number',
            updatedAt: currentTimestamp,
        },
        {
            key: 'address_en',
            value: 'Dubai Design District, Dubai, UAE',
            description: 'Company address in English',
            updatedAt: currentTimestamp,
        },
        {
            key: 'address_fr',
            value: 'Dubai Design District, Dubaï, EAU',
            description: 'Company address in French',
            updatedAt: currentTimestamp,
        },
        {
            key: 'address_ar',
            value: 'حي دبي للتصميم، دبي، الإمارات',
            description: 'Company address in Arabic',
            updatedAt: currentTimestamp,
        },
        {
            key: 'meta_title_en',
            value: 'Art Road - LED Panels & 3D Decoration Services in Dubai',
            description: 'SEO meta title in English',
            updatedAt: currentTimestamp,
        },
        {
            key: 'meta_description_en',
            value: 'Professional LED panel installation and 3D wall decoration services in Dubai. Transform your space with artistic lighting and decorative solutions.',
            description: 'SEO meta description in English',
            updatedAt: currentTimestamp,
        },
    ];

    await db.insert(siteSettings).values(sampleSettings);
    
    console.log('✅ Site settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});