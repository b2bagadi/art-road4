import { db } from '@/db';
import { leads } from '@/db/schema';

async function main() {
    const sampleLeads = [
        {
            name: 'Ahmed Hassan',
            email: 'ahmed.hassan@email.com',
            phone: '+971501234567',
            message: 'I am interested in LED panel installation for our new office space. We are looking for modern and energy-efficient lighting solutions.',
            serviceInterest: 'LED Panel Installation',
            source: 'website',
            status: 'new',
            createdAt: new Date('2024-12-15').toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Marie Dubois',
            email: 'marie.dubois@email.fr',
            phone: '+971509876543',
            message: 'We are opening a new French restaurant and would like to inquire about 3D wall decoration options to create an elegant ambiance.',
            serviceInterest: '3D Wall Decoration',
            source: 'website',
            status: 'contacted',
            createdAt: new Date('2024-12-08').toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+971502345678',
            message: 'Need event decoration services for our upcoming corporate annual gala. Looking for professional and sophisticated setup.',
            serviceInterest: 'Event Decoration',
            source: 'referral',
            status: 'converted',
            createdAt: new Date('2024-11-25').toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Fatima Al Mansouri',
            email: 'fatima.almansouri@email.ae',
            phone: '+971505678901',
            message: 'I own a retail store in Dubai Mall and need custom signage for branding. Please provide consultation and quote.',
            serviceInterest: 'Custom Signage',
            source: 'website',
            status: 'new',
            createdAt: new Date('2024-12-20').toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Pierre Martin',
            email: 'pierre.martin@email.fr',
            phone: '+971503456789',
            message: 'Inquiry about lighting design for residential villa. After reviewing options, decided to proceed with different approach.',
            serviceInterest: 'Lighting Design',
            source: 'social_media',
            status: 'closed',
            createdAt: new Date('2024-12-01').toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(leads).values(sampleLeads);
    
    console.log('✅ Leads seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});