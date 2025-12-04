"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.about": "About",
    "nav.contact": "Contact",
    
    // Gallery Page
    "gallery.hero.title": "Our Gallery",
    "gallery.hero.description": "Explore our portfolio of completed projects showcasing before and after transformations",
    "gallery.filter.all": "All Projects",
    "gallery.filter.led": "LED Panels",
    "gallery.filter.3d": "3D Decoration",
    "gallery.filter.events": "Events",
    "gallery.filter.other": "Other",
    "gallery.before": "BEFORE",
    "gallery.after": "AFTER",
    "gallery.noProjects": "No projects found in this category.",
    
    // Homepage
    "home.hero.title": "Transform Your Space with",
    "home.hero.subtitle": "Art & Technology",
    "home.hero.description": "Professional printing, stickers cutting, signage, LED panels, 3D decoration, and event design services in Agadir, Morocco",
    "home.hero.explore": "Explore Services",
    "home.hero.quote": "Get a Quote",
    
    "home.services.title": "Our Services",
    "home.services.description": "Comprehensive solutions for modern interior and exterior design",
    "home.services.led.title": "LED Panel Installation",
    "home.services.led.desc": "High-quality, energy-efficient LED panel systems for modern spaces",
    "home.services.3d.title": "3D Wall Decoration",
    "home.services.3d.desc": "Stunning 3D decorative elements that add depth and character",
    "home.services.event.title": "Event Decoration",
    "home.services.event.desc": "Professional decoration services for memorable events and celebrations",
    "home.services.learn": "Learn more",
    "home.services.viewAll": "View All Services",
    "home.services.from": "From",
    "home.services.requestQuote": "Request Quote",
    "home.gallery.title": "Featured Projects",
    "home.gallery.description": "Check out some of our best work",
    "home.gallery.viewAll": "View All Projects",
    
    "home.why.title": "Why Choose Art Road?",
    "home.why.description": "Experience excellence in every project",
    "home.why.expert": "Expert Team",
    "home.why.expert.desc": "Skilled professionals with years of experience",
    "home.why.quality": "Quality Materials",
    "home.why.quality.desc": "Premium materials for lasting results",
    "home.why.custom": "Custom Solutions",
    "home.why.custom.desc": "Tailored designs to match your vision",
    "home.why.timely": "Timely Delivery",
    "home.why.timely.desc": "Projects completed on schedule",
    
    "home.cta.title": "Ready to Transform Your Space?",
    "home.cta.description": "Contact us today for a free consultation and quote",
    "home.cta.button": "Get Started",
    
    // Services Page
    "services.hero.title": "Our Services",
    "services.hero.description": "Professional solutions for LED installations, 3D decorations, and event design",
    "services.requestQuote": "Request Quote",
    "services.custom.title": "Need a Custom Solution?",
    "services.custom.description": "We specialize in creating tailored designs that perfectly match your vision and requirements",
    "services.custom.button": "Contact Us Today",
    
    // About Page
    "about.hero.title": "About Art Road",
    "about.hero.description": "Pioneering innovative printing, signage, LED and 3D decoration solutions in Agadir, Morocco",
    "about.story.title": "Our Story",
    "about.story.p1": "Art Road began with a simple vision: to transform ordinary spaces into extraordinary experiences through the power of light and design. Based in Agadir, Morocco, we've grown from a small startup into one of the region's most trusted providers of printing, signage, LED panel installations and 3D decorative solutions.",
    "about.story.p2": "Our team of skilled professionals combines technical expertise with artistic sensibility to deliver projects that exceed expectations. Whether it's a corporate office, retail space, restaurant, or special event, we approach each project with the same commitment to excellence.",
    "about.team.title": "Our Team",
    "about.team.description": "Meet the talented professionals behind Art Road",
    "about.values.title": "Our Core Values",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc": "Constantly exploring new technologies and design trends",
    "about.values.quality": "Quality",
    "about.values.quality.desc": "Using only premium materials and expert craftsmanship",
    "about.values.collaboration": "Collaboration",
    "about.values.collaboration.desc": "Working closely with clients to bring visions to life",
    "about.values.excellence": "Excellence",
    "about.values.excellence.desc": "Striving for perfection in every project we undertake",
    "about.stats.projects": "Projects Completed",
    "about.stats.clients": "Happy Clients",
    "about.stats.team": "Team Members",
    "about.stats.experience": "Years Experience",
    "about.cta.title": "Let's Work Together",
    "about.cta.description": "Ready to bring your vision to life? Contact us for a consultation",
    "about.cta.button": "Get in Touch",
    
    // Contact Page
    "contact.hero.title": "Contact Us",
    "contact.hero.description": "Get in touch with our team for inquiries, quotes, or consultations",
    "contact.form.title": "Send Us a Message",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.service": "Service Interest",
    "contact.form.service.select": "Select a service",
    "contact.form.service.led": "LED Panel Installation",
    "contact.form.service.3d": "3D Wall Decoration",
    "contact.form.service.event": "Event Decoration",
    "contact.form.service.signage": "Custom Signage",
    "contact.form.service.lighting": "Lighting Design",
    "contact.form.service.other": "Other",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Tell us about your project...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Thank you! Your message has been sent successfully. We'll get back to you soon.",
    "contact.form.error": "Failed to submit form. Please try again.",
    "contact.info.title": "Contact Information",
    "contact.info.phone": "Phone",
    "contact.info.phone.hours": "Mon-Sat: 9AM - 6PM",
    "contact.info.email": "Email",
    "contact.info.email.note": "We reply within 24 hours",
    "contact.info.address": "Address",
    "contact.whatsapp.title": "WhatsApp Us",
    "contact.whatsapp.description": "For quick inquiries, reach us on WhatsApp",
    "contact.whatsapp.button": "Chat on WhatsApp",
    "contact.map.title": "Find Us",
    
    // Footer
    "footer.description": "Professional printing, stickers, signage, LED panels and 3D decoration services in Agadir, Morocco",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.services.led": "LED Panel Installation",
    "footer.services.3d": "3D Wall Decoration",
    "footer.services.event": "Event Decoration",
    "footer.services.signage": "Custom Signage",
    "footer.services.lighting": "Lighting Design",
    "footer.contact": "Contact",
    "footer.copyright": "Art Road. All rights reserved.",
    
    // Common
    "loading": "Loading...",
    
    // Add Trusted Companies translations
    "trustedCompanies.title": "Trusted By Companies",
  },
  fr: {
    // Header
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.gallery": "Galerie",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    
    // Gallery Page
    "gallery.hero.title": "Notre Galerie",
    "gallery.hero.description": "Explorez notre portfolio de projets terminés présentant des transformations avant et après",
    "gallery.filter.all": "Tous les Projets",
    "gallery.filter.led": "Panneaux LED",
    "gallery.filter.3d": "Décoration 3D",
    "gallery.filter.events": "Événements",
    "gallery.filter.other": "Autre",
    "gallery.before": "AVANT",
    "gallery.after": "APRÈS",
    "gallery.noProjects": "Aucun projet trouvé dans cette catégorie.",
    
    // Homepage
    "home.hero.title": "Transformez Votre Espace avec",
    "home.hero.subtitle": "Art & Technologie",
    "home.hero.description": "Services professionnels d'impression, découpe d'autocollants, signalétique, panneaux LED, décoration 3D et design d'événements à Agadir, Maroc",
    "home.hero.explore": "Explorer les Services",
    "home.hero.quote": "Obtenir un Devis",
    
    "home.services.title": "Nos Services",
    "home.services.description": "Solutions complètes pour le design intérieur et extérieur moderne",
    "home.services.led.title": "Installation de Panneaux LED",
    "home.services.led.desc": "Systèmes de panneaux LED économes en énergie de haute qualité pour espaces modernes",
    "home.services.3d.title": "Décoration Murale 3D",
    "home.services.3d.desc": "Éléments décoratifs 3D époustouflants qui ajoutent profondeur et caractère",
    "home.services.event.title": "Décoration d'Événements",
    "home.services.event.desc": "Services de décoration professionnels pour événements et célébrations mémorables",
    "home.services.learn": "En savoir plus",
    "home.services.viewAll": "Voir Tous les Services",
    "home.services.from": "À partir de",
    "home.services.requestQuote": "Demander un Devis",
    "home.gallery.title": "Projets en Vedette",
    "home.gallery.description": "Découvrez certains de nos meilleurs travaux",
    "home.gallery.viewAll": "Voir Tous les Projets",
    
    "home.why.title": "Pourquoi Choisir Art Road?",
    "home.why.description": "Découvrez l'excellence dans chaque projet",
    "home.why.expert": "Équipe Experte",
    "home.why.expert.desc": "Professionnels qualifiés avec des années d'expérience",
    "home.why.quality": "Matériaux de Qualité",
    "home.why.quality.desc": "Matériaux premium pour des résultats durables",
    "home.why.custom": "Solutions Personnalisées",
    "home.why.custom.desc": "Designs sur mesure pour correspondre à votre vision",
    "home.why.timely": "Livraison Ponctuelle",
    "home.why.timely.desc": "Projets terminés dans les délais",
    
    "home.cta.title": "Prêt à Transformer Votre Espace?",
    "home.cta.description": "Contactez-nous aujourd'hui pour une consultation et un devis gratuits",
    "home.cta.button": "Commencer",
    
    // Services Page
    "services.hero.title": "Nos Services",
    "services.hero.description": "Solutions professionnelles pour installations LED, décorations 3D et design d'événements",
    "services.requestQuote": "Demander un Devis",
    "services.custom.title": "Besoin d'une Solution Personnalisée?",
    "services.custom.description": "Nous nous spécialisons dans la création de designs sur mesure qui correspondent parfaitement à votre vision et à vos exigences",
    "services.custom.button": "Contactez-nous Aujourd'hui",
    
    // About Page
    "about.hero.title": "À Propos d'Art Road",
    "about.hero.description": "Pionnier des solutions d'impression, signalétique, LED et décoration 3D à Agadir, Maroc",
    "about.story.title": "Notre Histoire",
    "about.story.p1": "Art Road a commencé avec une vision simple: transformer des espaces ordinaires en expériences extraordinaires grâce au pouvoir de la lumière, du design et de l'impression. Basés à Agadir, Maroc, nous sommes passés d'une petite startup à l'un des fournisseurs les plus fiables de la région pour l'impression, la signalétique, les installations de panneaux LED et les solutions décoratives 3D.",
    "about.story.p2": "Notre équipe de professionnels qualifiés combine expertise technique et sensibilité artistique pour livrer des projets qui dépassent les attentes. Qu'il s'agisse d'un bureau d'entreprise, d'un espace commercial, d'un restaurant ou d'un événement spécial, nous abordons chaque projet avec le même engagement envers l'excellence.",
    "about.team.title": "Notre Équipe",
    "about.team.description": "Rencontrez les professionnels talentueux derrière Art Road",
    "about.values.title": "Nos Valeurs Fondamentales",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc": "Explorer constamment de nouvelles technologies et tendances design",
    "about.values.quality": "Qualité",
    "about.values.quality.desc": "Utiliser uniquement des matériaux premium et un savoir-faire expert",
    "about.values.collaboration": "Collaboration",
    "about.values.collaboration.desc": "Travailler étroitement avec les clients pour donner vie aux visions",
    "about.values.excellence": "Excellence",
    "about.values.excellence.desc": "Viser la perfection dans chaque projet entrepris",
    "about.stats.projects": "Projets Terminés",
    "about.stats.clients": "Clients Satisfaits",
    "about.stats.team": "Membres de l'Équipe",
    "about.stats.experience": "Années d'Expérience",
    "about.cta.title": "Travaillons Ensemble",
    "about.cta.description": "Prêt à donner vie à votre vision? Contactez-nous pour une consultation",
    "about.cta.button": "Entrer en Contact",
    
    // Contact Page
    "contact.hero.title": "Contactez-nous",
    "contact.hero.description": "Entrez en contact avec notre équipe pour des demandes de renseignements, devis ou consultations",
    "contact.form.title": "Envoyez-nous un Message",
    "contact.form.name": "Nom",
    "contact.form.email": "Email",
    "contact.form.phone": "Téléphone",
    "contact.form.service": "Service d'Intérêt",
    "contact.form.service.select": "Sélectionner un service",
    "contact.form.service.led": "Installation de Panneaux LED",
    "contact.form.service.3d": "Décoration Murale 3D",
    "contact.form.service.event": "Décoration d'Événements",
    "contact.form.service.signage": "Signalétique Personnalisée",
    "contact.form.service.lighting": "Design d'Éclairage",
    "contact.form.service.other": "Autre",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Parlez-nous de votre projet...",
    "contact.form.send": "Envoyer le Message",
    "contact.form.sending": "Envoi...",
    "contact.form.success": "Merci! Votre message a été envoyé avec succès. Nous vous répondrons bientôt.",
    "contact.form.error": "Échec de l'envoi du formulaire. Veuillez réessayer.",
    "contact.info.title": "Informations de Contact",
    "contact.info.phone": "Téléphone",
    "contact.info.phone.hours": "Lun-Sam: 9h - 18h",
    "contact.info.email": "Email",
    "contact.info.email.note": "Nous répondons sous 24 heures",
    "contact.info.address": "Adresse",
    "contact.whatsapp.title": "WhatsApp",
    "contact.whatsapp.description": "Pour des demandes rapides, contactez-nous sur WhatsApp",
    "contact.whatsapp.button": "Discuter sur WhatsApp",
    "contact.map.title": "Nous trouver",
    
    // Footer
    "footer.description": "Impression professionnelle, autocollants, signalétique, panneaux LED et décoration 3D à Agadir, Maroc",
    "footer.quickLinks": "Liens Rapides",
    "footer.services": "Services",
    "footer.services.led": "Installation de Panneaux LED",
    "footer.services.3d": "Décoration Murale 3D",
    "footer.services.event": "Décoration d'Événements",
    "footer.services.signage": "Signalétique Personnalisée",
    "footer.services.lighting": "Design d'Éclairage",
    "footer.contact": "Contact",
    "footer.copyright": "Art Road. Tous droits réservés.",
    
    // Common
    "loading": "Chargement...",
    
    // Add Trusted Companies translations
    "trustedCompanies.title": "Approuvé par des Entreprises",
  },
  ar: {
    // Header
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.gallery": "المعرض",
    "nav.about": "عن الشركة",
    "nav.contact": "اتصل بنا",
    
    // Gallery Page
    "gallery.hero.title": "معرضنا",
    "gallery.hero.description": "استكشف محفظة المشاريع المنجزة التي تعرض التحولات قبل وبعد",
    "gallery.filter.all": "جميع المشاريع",
    "gallery.filter.led": "لوحات LED",
    "gallery.filter.3d": "ديكور ثلاثي الأبعاد",
    "gallery.filter.events": "الفعاليات",
    "gallery.filter.other": "أخرى",
    "gallery.before": "قبل",
    "gallery.after": "بعد",
    "gallery.noProjects": "لم يتم العثور على مشاريع في هذه الفئة.",
    
    // Homepage
    "home.hero.title": "حوّل مساحتك مع",
    "home.hero.subtitle": "الفن والتكنولوجيا",
    "home.hero.description": "خدمات احترافية للطباعة وقص الملصقات واللافتات ولوحات LED والديكور ثلاثي الأبعاد وتصميم الفعاليات في أكادير، المغرب",
    "home.hero.explore": "استكشف الخدمات",
    "home.hero.quote": "احصل على عرض سعر",
    
    "home.services.title": "خدماتنا",
    "home.services.description": "حلول شاملة للتصميم الداخلي والخارجي الحديث",
    "home.services.led.title": "تركيب لوحات LED",
    "home.services.led.desc": "أنظمة لوحات LED عالية الجودة وموفرة للطاقة للمساحات الحديثة",
    "home.services.3d.title": "ديكور الجدران ثلاثي الأبعاد",
    "home.services.3d.desc": "عناصر زخرفية ثلاثية الأبعاد مذهلة تضيف عمقًا وطابعًا",
    "home.services.event.title": "تزيين الفعاليات",
    "home.services.event.desc": "خدمات تزيين احترافية للفعاليات والاحتفالات التي لا تُنسى",
    "home.services.learn": "اعرف المزيد",
    "home.services.viewAll": "عرض جميع الخدمات",
    "home.services.from": "ابتداءً من",
    "home.services.requestQuote": "طلب عرض سعر",
    "home.gallery.title": "المشاريع المميزة",
    "home.gallery.description": "تحقق من بعض أفضل أعمالنا",
    "home.gallery.viewAll": "عرض جميع المشاريع",
    
    "home.why.title": "لماذا تختار آرت رود؟",
    "home.why.description": "استمتع بالتميز في كل مشروع",
    "home.why.expert": "فريق خبراء",
    "home.why.expert.desc": "محترفون ماهرون بسنوات من الخبرة",
    "home.why.quality": "مواد عالية الجودة",
    "home.why.quality.desc": "مواد ممتازة لنتائج دائمة",
    "home.why.custom": "حلول مخصصة",
    "home.why.custom.desc": "تصاميم مصممة خصيصًا لتتناسب مع رؤيتك",
    "home.why.timely": "تسليم في الوقت المحدد",
    "home.why.timely.desc": "إنجاز المشاريع في الموعد المحدد",
    
    "home.cta.title": "هل أنت مستعد لتحويل مساحتك؟",
    "home.cta.description": "اتصل بنا اليوم للحصول على استشارة وعرض سعر مجاني",
    "home.cta.button": "ابدأ الآن",
    
    // Services Page
    "services.hero.title": "خدماتنا",
    "services.hero.description": "حلول احترافية لتركيب LED والديكورات ثلاثية الأبعاد وتصميم الفعاليات",
    "services.requestQuote": "طلب عرض سعر",
    "services.custom.title": "هل تحتاج إلى حل مخصص؟",
    "services.custom.description": "نحن متخصصون في إنشاء تصاميم مخصصة تتناسب تمامًا مع رؤيتك ومتطلباتك",
    "services.custom.button": "اتصل بنا اليوم",
    
    // About Page
    "about.hero.title": "عن آرت رود",
    "about.hero.description": "رائدون في حلول الطباعة واللافتات وLED والديكور ثلاثي الأبعاد في أكادير، المغرب",
    "about.story.title": "قصتنا",
    "about.story.p1": "بدأت آرت رود برؤية بسيطة: تحويل المساحات العادية إلى تجارب استثنائية من خلال قوة الضوء والتصميم والطباعة. مقرنا في أكادير، المغرب، ونمونا من شركة ناشئة صغيرة إلى واحد من أكثر مزودي الطباعة واللافتات وتركيب لوحات LED والحلول الزخرفية ثلاثية الأبعاد موثوقية في المنطقة.",
    "about.story.p2": "يجمع فريقنا من المحترفين المهرة بين الخبرة التقنية والحساسية الفنية لتقديم مشاريع تتجاوز التوقعات. سواء كان مكتب شركة أو مساحة تجارية أو مطعم أو حدث خاص، نتعامل مع كل مشروع بنفس الالتزام بالتميز.",
    "about.team.title": "فريقنا",
    "about.team.description": "تعرف على المحترفين الموهوبين وراء آرت رود",
    "about.values.title": "قيمنا الأساسية",
    "about.values.innovation": "الابتكار",
    "about.values.innovation.desc": "استكشاف مستمر للتقنيات الجديدة وأحدث اتجاهات التصميم",
    "about.values.quality": "الجودة",
    "about.values.quality.desc": "استخدام مواد ممتازة وحرفية خبيرة فقط",
    "about.values.collaboration": "التعاون",
    "about.values.collaboration.desc": "العمل عن كثب مع العملاء لإحياء الرؤى",
    "about.values.excellence": "التميز",
    "about.values.excellence.desc": "السعي للكمال في كل مشروع نقوم به",
    "about.stats.projects": "مشاريع منجزة",
    "about.stats.clients": "عملاء سعداء",
    "about.stats.team": "أعضاء الفريق",
    "about.stats.experience": "سنوات من الخبرة",
    "about.cta.title": "لنعمل معًا",
    "about.cta.description": "هل أنت مستعد لإحياء رؤيتك؟ اتصل بنا للحصول على استشارة",
    "about.cta.button": "تواصل معنا",
    
    // Contact Page
    "contact.hero.title": "اتصل بنا",
    "contact.hero.description": "تواصل مع فريقنا للاستفسارات أو عروض الأسعار أو الاستشارات",
    "contact.form.title": "أرسل لنا رسالة",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.phone": "الهاتف",
    "contact.form.service": "الخدمة المهتم بها",
    "contact.form.service.select": "اختر خدمة",
    "contact.form.service.led": "تركيب لوحات LED",
    "contact.form.service.3d": "ديكور الجدران ثلاثي الأبعاد",
    "contact.form.service.event": "تزيين الفعاليات",
    "contact.form.service.signage": "لافتات مخصصة",
    "contact.form.service.lighting": "تصميم الإضاءة",
    "contact.form.service.other": "أخرى",
    "contact.form.message": "الرسالة",
    "contact.form.message.placeholder": "أخبرنا عن مشروعك...",
    "contact.form.send": "إرسال الرسالة",
    "contact.form.sending": "جاري الإرسال...",
    "contact.form.success": "شكرًا لك! تم إرسال رسالتك بنجاح. سنعود إليك قريبًا.",
    "contact.form.error": "فشل إرسال النموذج. يرجى المحاولة مرة أخرى.",
    "contact.info.title": "معلومات الاتصال",
    "contact.info.phone": "الهاتف",
    "contact.info.phone.hours": "الاثنين - السبت: 9 صباحًا - 6 مساءً",
    "contact.info.email": "البريد الإلكتروني",
    "contact.info.email.note": "نرد خلال 24 ساعة",
    "contact.info.address": "العنوان",
    "contact.whatsapp.title": "واتساب",
    "contact.whatsapp.description": "للاستفسارات السريعة، تواصل معنا على الواتساب",
    "contact.whatsapp.button": "الدردشة على الواتساب",
    "contact.map.title": "اعثر علينا",
    
    // Footer
    "footer.description": "خدمات احترافية للطباعة والملصقات واللافتات ولوحات LED والديكور ثلاثي الأبعاد في أكادير، المغرب",
    "footer.quickLinks": "روابط سريعة",
    "footer.services": "الخدمات",
    "footer.services.led": "تركيب لوحات LED",
    "footer.services.3d": "ديكور الجدران ثلاثي الأبعاد",
    "footer.services.event": "تزيين الفعاليات",
    "footer.services.signage": "لافتات مخصصة",
    "footer.services.lighting": "تصميم الإضاءة",
    "footer.contact": "اتصل بنا",
    "footer.copyright": "آرت رود. جميع الحقوق محفوظة.",
    
    // Common
    "loading": "جاري التحميل...",
    
    // Add Trusted Companies translations
    "trustedCompanies.title": "موثوق به من قبل شركات",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      setLanguageState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    const enDict = translations.en as Record<string, string>;

    // Exact match in current language
    if (dict[key]) return dict[key];

    // If key looks like "hero.title" or similar (missing namespace), try common namespaces
    const commonNamespaces = ["home", "services", "gallery", "about", "contact"];
    if (key.includes(".") && !/^(home|services|gallery|about|contact|nav|footer)\./.test(key)) {
      for (const ns of commonNamespaces) {
        const candidate = `${ns}.${key}`;
        if (dict[candidate]) return dict[candidate];
      }
      // fallback to English for namespaced candidates
      for (const ns of commonNamespaces) {
        const candidate = `${ns}.${key}`;
        if (enDict[candidate]) return enDict[candidate];
      }
    }

    // Suffix fallback: find any key that ends with ".<key>"
    const suffix = `.${key}`;
    const found = Object.keys(dict).find((k) => k.endsWith(suffix));
    if (found) return dict[found];

    // Fallback to English exact
    if (enDict[key]) return enDict[key];

    // Fallback to English suffix
    const enFound = Object.keys(enDict).find((k) => k.endsWith(suffix));
    if (enFound) return enDict[enFound];

    // Last resort: return key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}