import { db } from '@/db';
import { services } from '@/db/schema';

async function main() {
    const sampleServices = [
        {
            titleEn: 'LED Panel Installation',
            titleFr: 'Installation de Panneaux LED',
            titleAr: 'تركيب ألواح LED',
            descriptionEn: 'High-quality LED panel installation for modern spaces',
            descriptionFr: 'Installation de panneaux LED de haute qualité pour espaces modernes',
            descriptionAr: 'تركيب ألواح LED عالية الجودة للمساحات الحديثة',
            imageUrl: '/images/services/service-1.jpg',
            icon: 'lightbulb',
            orderIndex: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            titleEn: '3D Wall Decoration',
            titleFr: 'Décoration Murale 3D',
            titleAr: 'ديكور الجدران ثلاثي الأبعاد',
            descriptionEn: 'Transform your walls with stunning 3D decorative elements',
            descriptionFr: 'Transformez vos murs avec des éléments décoratifs 3D époustouflants',
            descriptionAr: 'حول جدرانك بعناصر زخرفية ثلاثية الأبعاد مذهلة',
            imageUrl: '/images/services/service-2.jpg',
            icon: 'cube',
            orderIndex: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            titleEn: 'Event Decoration',
            titleFr: 'Décoration d\'Événements',
            titleAr: 'تزيين الفعاليات',
            descriptionEn: 'Professional decoration services for all types of events',
            descriptionFr: 'Services de décoration professionnels pour tous types d\'événements',
            descriptionAr: 'خدمات تزيين احترافية لجميع أنواع الفعاليات',
            imageUrl: '/images/services/service-3.jpg',
            icon: 'star',
            orderIndex: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            titleEn: 'Custom Signage',
            titleFr: 'Enseignes Personnalisées',
            titleAr: 'لافتات مخصصة',
            descriptionEn: 'Eye-catching custom signage for your business',
            descriptionFr: 'Enseignes personnalisées accrocheuses pour votre entreprise',
            descriptionAr: 'لافتات مخصصة لافتة للنظر لعملك',
            imageUrl: '/images/services/service-4.jpg',
            icon: 'tag',
            orderIndex: 4,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            titleEn: 'Lighting Design',
            titleFr: 'Conception d\'Éclairage',
            titleAr: 'تصميم الإضاءة',
            descriptionEn: 'Creative lighting solutions for residential and commercial spaces',
            descriptionFr: 'Solutions d\'éclairage créatives pour espaces résidentiels et commerciaux',
            descriptionAr: 'حلول إضاءة إبداعية للمساحات السكنية والتجارية',
            imageUrl: '/images/services/service-5.jpg',
            icon: 'sun',
            orderIndex: 5,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            titleEn: 'Interior Enhancement',
            titleFr: 'Amélioration Intérieure',
            titleAr: 'تحسين الديكور الداخلي',
            descriptionEn: 'Complete interior enhancement with artistic touches',
            descriptionFr: 'Amélioration intérieure complète avec des touches artistiques',
            descriptionAr: 'تحسين داخلي كامل مع لمسات فنية',
            imageUrl: '/images/services/service-6.jpg',
            icon: 'home',
            orderIndex: 6,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(services).values(sampleServices);
    
    console.log('✅ Services seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});