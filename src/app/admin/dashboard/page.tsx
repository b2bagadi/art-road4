"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  LayoutDashboard,
  FileText,
  Image,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  MapPin,
  Phone,
  Lightbulb,
  Sparkles,
  Star,
  Wrench,
  Hammer,
  Brush,
  Palette,
  PanelsTopLeft,
  Users,
  Info,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Service = {
  id: number;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  imageUrl: string;
  icon: string;
  orderIndex: number;
  isActive: boolean;
  priceStart?: number;
  currency?: string;
  isFavourite?: boolean;
};

type GalleryItem = {
  id: number;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  descriptionEn: string;
  descriptionFr: string;
  descriptionAr: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  category: string;
  orderIndex: number;
  isFeatured: boolean;
  isActive: boolean;
  showOnHomepage: boolean;
};

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceInterest: string | null;
  source: string;
  status: string;
  createdAt: string;
};

type TrustedCompany = {
  id: number;
  logoUrl: string;
  orderIndex: number;
  isActive: boolean;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "gallery" | "leads" | "contact" | "about" | "companies">("overview");
  
  // Logo state
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLoading, setLogoLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    services: 0,
    gallery: 0,
    leads: 0,
    newLeads: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    titleEn: "",
    titleFr: "",
    titleAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAr: "",
    imageUrl: "",
    icon: "",
    orderIndex: 0,
    isActive: true,
    priceStart: 0,
    currency: "MAD",
    isFavourite: false,
  });

  // Icon picker helpers for Services
  const iconMap = {
    lightbulb: Lightbulb,
    sparkles: Sparkles,
    star: Star,
    wrench: Wrench,
    hammer: Hammer,
    brush: Brush,
    palette: Palette,
    panelstopleft: PanelsTopLeft,
  } as const;
  const iconOptions = [
    { key: "lightbulb", label: "Lightbulb", Icon: Lightbulb },
    { key: "sparkles", label: "Sparkles", Icon: Sparkles },
    { key: "star", label: "Star", Icon: Star },
    { key: "wrench", label: "Wrench", Icon: Wrench },
    { key: "hammer", label: "Hammer", Icon: Hammer },
    { key: "brush", label: "Brush", Icon: Brush },
    { key: "palette", label: "Palette", Icon: Palette },
    { key: "panelstopleft", label: "PanelsTopLeft", Icon: PanelsTopLeft },
  ];
  const renderIcon = (name?: string, size = 18) => {
    if (!name) return null;
    const key = name.replace(/\s+/g, "").toLowerCase() as keyof typeof iconMap;
    const IconC = iconMap[key];
    if (!IconC) return <Lightbulb size={size} className="text-[var(--cyan)]" />;
    return <IconC size={size} className="text-[var(--cyan)]" />;
  };

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryDialog, setGalleryDialog] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    titleEn: "",
    titleFr: "",
    titleAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAr: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    category: "led-panels",
    orderIndex: 0,
    isFeatured: false,
    isActive: true,
    showOnHomepage: false,
  });

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadDialog, setLeadDialog] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // Contact Settings
  const [contactSettings, setContactSettings] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    locationUrl: "",
    logoUrl: "",
    heroBackgroundUrl: "",
    googleMapsIframeCode: "",
    logoUrlLight: "",
    logoUrlDark: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  // Inline notice (replaces alert())
  const [contactNotice, setContactNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Preview toggle for map iframe
  const [showMapPreview, setShowMapPreview] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamDialog, setTeamDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any | null>(null);
  const [teamForm, setTeamForm] = useState({
    nameEn: "",
    nameFr: "",
    nameAr: "",
    photoUrl: "",
    orderIndex: 0,
  });

  // About settings state
  const [aboutSettings, setAboutSettings] = useState({
    aboutArtRoadEn: "",
    aboutArtRoadFr: "",
    aboutArtRoadAr: "",
    ourStoryEn: "",
    ourStoryFr: "",
    ourStoryAr: "",
  });
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutSaving, setAboutSaving] = useState(false);
  const [aboutNotice, setAboutNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Trusted Companies state
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companyDialog, setCompanyDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<TrustedCompany | null>(null);
  const [companyForm, setCompanyForm] = useState({
    logoUrl: "",
    orderIndex: 0,
    isActive: true,
  });

  // Confirm dialog (replaces confirm())
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ type: "service" | "gallery" | "lead" | "team" | "company"; id: number } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin_logged_in");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchLogoUrl();
    }
  }, [isAuthenticated]);

  const handleSignOut = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin/login");
  };

  const fetchLogoUrl = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Prefer exact key, but gracefully fall back to any key that includes "logo"
        const exact = data.find((s: any) => s.key === "logo_url")?.value;
        const fuzzy = data.find(
          (s: any) => typeof s.key === "string" && s.key.toLowerCase().includes("logo")
        )?.value;
        const url = exact || fuzzy || "";
        if (url) {
          setLogoUrl(url);
        }
      }
    } catch (error) {
      console.error("Failed to fetch logo:", error);
    } finally {
      setLogoLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [servicesRes, galleryRes, leadsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/gallery"),
        fetch("/api/leads"),
      ]);

      const [servicesData, galleryData, leadsData] = await Promise.all([
        servicesRes.json(),
        galleryRes.json(),
        leadsRes.json(),
      ]);

      const newLeads = Array.isArray(leadsData)
        ? leadsData.filter((lead: any) => lead.status === "new").length
        : 0;

      setStats({
        services: Array.isArray(servicesData) ? servicesData.length : 0,
        gallery: Array.isArray(galleryData) ? galleryData.length : 0,
        leads: Array.isArray(leadsData) ? leadsData.length : 0,
        newLeads,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Contact Settings functions
  const fetchContactSettings = async () => {
    setContactLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const settingsMap: any = {};
        data.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });

        setContactSettings({
          email: settingsMap.email || "",
          phone: settingsMap.phone || "",
          whatsapp: settingsMap.whatsapp || "",
          address: settingsMap.address || "",
          locationUrl: settingsMap.location_url || "",
          logoUrl: settingsMap.logo_url || "",
          heroBackgroundUrl: settingsMap.hero_background_url || "",
          googleMapsIframeCode: settingsMap.google_maps_iframe_code || "",
          logoUrlLight: settingsMap.logo_url_light || "",
          logoUrlDark: settingsMap.logo_url_dark || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch contact settings:", error);
    } finally {
      setContactLoading(false);
    }
  };

  const handleSaveContactSettings = async () => {
    setContactSaving(true);
    setContactNotice(null);
    try {
      const settings = [
        { key: "email", value: contactSettings.email, description: "Contact email" },
        { key: "phone", value: contactSettings.phone, description: "Contact phone" },
        { key: "whatsapp", value: contactSettings.whatsapp, description: "WhatsApp link" },
        { key: "address", value: contactSettings.address, description: "Physical address" },
        { key: "location_url", value: contactSettings.locationUrl, description: "Google Maps URL" },
        { key: "logo_url", value: contactSettings.logoUrl, description: "Logo URL (fallback)" },
        { key: "hero_background_url", value: contactSettings.heroBackgroundUrl, description: "Hero background URL" },
        { key: "google_maps_iframe_code", value: contactSettings.googleMapsIframeCode, description: "Google Maps embed code" },
        { key: "logo_url_light", value: contactSettings.logoUrlLight, description: "Logo URL (light mode)" },
        { key: "logo_url_dark", value: contactSettings.logoUrlDark, description: "Logo URL (dark mode)" },
      ].filter((s) => typeof s.value === "string" && s.value.trim() !== "");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setContactNotice({ type: "success", message: "Contact settings saved successfully" });
      } else {
        setContactNotice({ type: "error", message: "Failed to save settings" });
      }
    } catch (error) {
      console.error("Failed to save contact settings:", error);
      setContactNotice({ type: "error", message: "Failed to save settings. Please try again." });
    } finally {
      setContactSaving(false);
      setTimeout(() => setContactNotice(null), 4000);
    }
  };

  // Trusted Companies functions
  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    try {
      const res = await fetch("/api/trusted-companies?limit=100&sort=orderIndex&order=asc");
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch trusted companies:", error);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyForm({ logoUrl: "", orderIndex: 0, isActive: true });
    setCompanyDialog(true);
  };

  const handleEditCompany = (company: TrustedCompany) => {
    setEditingCompany(company);
    setCompanyForm({
      logoUrl: company.logoUrl ?? "",
      orderIndex: company.orderIndex ?? 0,
      isActive: Boolean(company.isActive),
    });
    setCompanyDialog(true);
  };

  const handleSaveCompany = async () => {
    try {
      const method = editingCompany ? "PUT" : "POST";
      const url = editingCompany ? `/api/trusted-companies?id=${editingCompany.id}` : "/api/trusted-companies";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });

      if (res.ok) {
        setCompanyDialog(false);
        fetchCompanies();
      }
    } catch (error) {
      console.error("Failed to save trusted company:", error);
    }
  };

  const requestDeleteCompany = (id: number) => {
    setConfirmTarget({ type: "company" as any, id });
    setConfirmOpen(true);
  };

  const handleToggleCompanyActive = async (company: TrustedCompany) => {
    try {
      const res = await fetch(`/api/trusted-companies?id=${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !company.isActive }),
      });
      if (res.ok) {
        fetchCompanies();
      }
    } catch (error) {
      console.error("Failed to toggle company:", error);
    }
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    
    try {
      let endpoint = "";
      switch (confirmTarget.type) {
        case "service":
          endpoint = `/api/services?id=${confirmTarget.id}`;
          break;
        case "gallery":
          endpoint = `/api/gallery?id=${confirmTarget.id}`;
          break;
        case "lead":
          endpoint = `/api/leads?id=${confirmTarget.id}`;
          break;
        case "team":
          endpoint = `/api/team?id=${confirmTarget.id}`;
          break;
        case "company":
          endpoint = `/api/trusted-companies?id=${confirmTarget.id}`;
          break;
      }

      const res = await fetch(endpoint, { method: "DELETE" });
      
      if (res.ok) {
        // Refresh appropriate data
        if (confirmTarget.type === "service") {
          fetchServices();
          fetchStats();
        } else if (confirmTarget.type === "gallery") {
          fetchGallery();
          fetchStats();
        } else if (confirmTarget.type === "lead") {
          fetchLeads();
          fetchStats();
        } else if (confirmTarget.type === "team") {
          fetchTeam();
        } else if (confirmTarget.type === "company") {
          fetchCompanies();
        }
        
        setConfirmOpen(false);
        setConfirmTarget(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Services functions
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch("/api/services?limit=100");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      titleEn: "",
      titleFr: "",
      titleAr: "",
      descriptionEn: "",
      descriptionFr: "",
      descriptionAr: "",
      imageUrl: "",
      icon: "",
      orderIndex: 0,
      isActive: true,
      priceStart: 0,
      currency: "MAD",
      isFavourite: false,
    });
    setServiceDialog(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      titleEn: service.titleEn ?? "",
      titleFr: service.titleFr ?? "",
      titleAr: service.titleAr ?? "",
      descriptionEn: service.descriptionEn ?? "",
      descriptionFr: service.descriptionFr ?? "",
      descriptionAr: service.descriptionAr ?? "",
      imageUrl: service.imageUrl ?? "",
      icon: service.icon ?? "",
      orderIndex: service.orderIndex ?? 0,
      isActive: Boolean(service.isActive),
      priceStart: typeof service.priceStart === "number" ? service.priceStart : 0,
      currency: service.currency || "MAD",
      isFavourite: Boolean(service.isFavourite),
    });
    setServiceDialog(true);
  };

  const handleSaveService = async () => {
    try {
      const method = editingService ? "PUT" : "POST";
      const url = editingService ? `/api/services?id=${editingService.id}` : "/api/services";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });

      if (res.ok) {
        setServiceDialog(false);
        fetchServices();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const requestDeleteService = (id: number) => {
    setConfirmTarget({ type: "service", id });
    setConfirmOpen(true);
  };

  const handleToggleServiceActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services?id=${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to toggle service:", error);
    }
  };

  const handleToggleServiceFavourite = async (service: Service) => {
    try {
      const res = await fetch(`/api/services?id=${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavourite: !Boolean(service.isFavourite) }),
      });
      if (res.ok) {
        fetchServices();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    }
  };

  // Gallery functions
  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/gallery?limit=100");
      const data = await res.json();
      setGallery(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleAddGallery = () => {
    setEditingGallery(null);
    setGalleryForm({
      titleEn: "",
      titleFr: "",
      titleAr: "",
      descriptionEn: "",
      descriptionFr: "",
      descriptionAr: "",
      beforeImageUrl: "",
      afterImageUrl: "",
      category: "led-panels",
      orderIndex: 0,
      isFeatured: false,
      isActive: true,
      showOnHomepage: false,
    });
    setGalleryDialog(true);
  };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGallery(item);
    setGalleryForm({
      titleEn: item.titleEn ?? "",
      titleFr: item.titleFr ?? "",
      titleAr: item.titleAr ?? "",
      descriptionEn: item.descriptionEn ?? "",
      descriptionFr: item.descriptionFr ?? "",
      descriptionAr: item.descriptionAr ?? "",
      beforeImageUrl: item.beforeImageUrl ?? "",
      afterImageUrl: item.afterImageUrl ?? "",
      category: item.category ?? "led-panels",
      orderIndex: item.orderIndex ?? 0,
      isFeatured: Boolean(item.isFeatured),
      isActive: Boolean(item.isActive),
      showOnHomepage: Boolean(item.showOnHomepage),
    });
    setGalleryDialog(true);
  };

  const handleSaveGallery = async () => {
    try {
      const method = editingGallery ? "PUT" : "POST";
      const url = editingGallery ? `/api/gallery?id=${editingGallery.id}` : "/api/gallery";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm),
      });

      if (res.ok) {
        setGalleryDialog(false);
        fetchGallery();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to save gallery item:", error);
    }
  };

  const requestDeleteGallery = (id: number) => {
    setConfirmTarget({ type: "gallery", id });
    setConfirmOpen(true);
  };

  const handleToggleGalleryFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      });
      if (res.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error("Failed to toggle gallery item:", error);
    }
  };

  const handleToggleGalleryActive = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error("Failed to toggle gallery active:", error);
    }
  };

  const handleToggleGalleryShowOnHomepage = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHomepage: !item.showOnHomepage }),
      });
      if (res.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error("Failed to toggle show on homepage:", error);
    }
  };

  // Leads functions
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads?limit=100");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead);
    setLeadDialog(true);
  };

  const handleUpdateLeadStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const requestDeleteLead = (id: number) => {
    setConfirmTarget({ type: "lead", id });
    setConfirmOpen(true);
  };

  // Team functions
  const fetchTeam = async () => {
    setTeamLoading(true);
    try {
      const res = await fetch("/api/team?limit=100&sort=orderIndex&order=asc");
      const data = await res.json();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({ nameEn: "", nameFr: "", nameAr: "", photoUrl: "", orderIndex: 0 });
    setTeamDialog(true);
  };

  const handleEditTeam = (member: any) => {
    setEditingTeam(member);
    setTeamForm({
      nameEn: member.nameEn ?? "",
      nameFr: member.nameFr ?? "",
      nameAr: member.nameAr ?? "",
      photoUrl: member.photoUrl ?? "",
      orderIndex: member.orderIndex ?? 0,
    });
    setTeamDialog(true);
  };

  const handleSaveTeam = async () => {
    try {
      const method = editingTeam ? "PUT" : "POST";
      const url = editingTeam ? `/api/team?id=${editingTeam.id}` : "/api/team";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamForm),
      });

      if (res.ok) {
        setTeamDialog(false);
        fetchTeam();
      }
    } catch (error) {
      console.error("Failed to save team member:", error);
    }
  };

  const requestDeleteTeam = (id: number) => {
    setConfirmTarget({ type: "team", id });
    setConfirmOpen(true);
  };

  // About settings functions
  const fetchAboutSettings = async () => {
    setAboutLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const settingsMap: any = {};
        data.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });

        setAboutSettings({
          aboutArtRoadEn: settingsMap.about_art_road_en || "",
          aboutArtRoadFr: settingsMap.about_art_road_fr || "",
          aboutArtRoadAr: settingsMap.about_art_road_ar || "",
          ourStoryEn: settingsMap.our_story_en || "",
          ourStoryFr: settingsMap.our_story_fr || "",
          ourStoryAr: settingsMap.our_story_ar || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch about settings:", error);
    } finally {
      setAboutLoading(false);
    }
  };

  const handleSaveAboutSettings = async () => {
    setAboutSaving(true);
    setAboutNotice(null);
    try {
      const settings = [
        { key: "about_art_road_en", value: aboutSettings.aboutArtRoadEn, description: "About Art Road text (English)" },
        { key: "about_art_road_fr", value: aboutSettings.aboutArtRoadFr, description: "About Art Road text (French)" },
        { key: "about_art_road_ar", value: aboutSettings.aboutArtRoadAr, description: "About Art Road text (Arabic)" },
        { key: "our_story_en", value: aboutSettings.ourStoryEn, description: "Our Story text (English)" },
        { key: "our_story_fr", value: aboutSettings.ourStoryFr, description: "Our Story text (French)" },
        { key: "our_story_ar", value: aboutSettings.ourStoryAr, description: "Our Story text (Arabic)" },
      ].filter((s) => typeof s.value === "string" && s.value.trim() !== "");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setAboutNotice({ type: "success", message: "About settings saved successfully" });
      } else {
        setAboutNotice({ type: "error", message: "Failed to save settings" });
      }
    } catch (error) {
      console.error("Failed to save about settings:", error);
      setAboutNotice({ type: "error", message: "Failed to save settings. Please try again." });
    } finally {
      setAboutSaving(false);
      setTimeout(() => setAboutNotice(null), 4000);
    }
  };

  useEffect(() => {
    if (activeTab === "services" && services.length === 0) {
      fetchServices();
    } else if (activeTab === "gallery" && gallery.length === 0) {
      fetchGallery();
    } else if (activeTab === "leads" && leads.length === 0) {
      fetchLeads();
    } else if (activeTab === "contact") {
      if (contactSettings.email === "" && !contactLoading) {
        fetchContactSettings();
      }
    } else if (activeTab === "about") {
      if (teamMembers.length === 0) fetchTeam();
      if (aboutSettings.aboutArtRoadEn === "" && !aboutLoading) {
        fetchAboutSettings();
      }
    } else if (activeTab === "companies" && companies.length === 0) {
      fetchCompanies();
    }
  }, [activeTab]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--charcoal)]">
        <Loader2 className="animate-spin text-[var(--cyan)]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--charcoal)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {logoLoading ? (
              <Loader2 className="animate-spin text-[var(--cyan)]" size={24} />
            ) : logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <>
                <LayoutDashboard className="text-[var(--cyan)]" size={24} />
                <h1 className="text-xl font-bold text-white">Art Road Admin</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">artroad10</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[var(--cyan)] text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="inline mr-2" size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "services"
                ? "border-[var(--cyan)] text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="inline mr-2" size={16} />
            Services ({stats.services})
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-[var(--magenta)] text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Image className="inline mr-2" size={16} />
            Gallery ({stats.gallery})
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "leads"
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Mail className="inline mr-2" size={16} />
            Leads ({stats.leads})
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "contact"
                ? "border-green-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Settings className="inline mr-2" size={16} />
            Contact Settings
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "about"
                ? "border-purple-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Info className="inline mr-2" size={16} />
            About
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "companies"
                ? "border-yellow-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Building2 className="inline mr-2" size={16} />
            Trusted Companies
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, Admin!</h2>
              <p className="text-gray-400">Manage your Art Road website content and leads</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="text-[var(--cyan)]" size={24} />
                  {statsLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{stats.services}</div>
                <div className="text-sm text-gray-400">Active Services</div>
              </div>

              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Image className="text-[var(--magenta)]" size={24} />
                  {statsLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{stats.gallery}</div>
                <div className="text-sm text-gray-400">Gallery Items</div>
              </div>

              <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Mail className="text-blue-500" size={24} />
                  {statsLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{stats.leads}</div>
                <div className="text-sm text-gray-400">Total Leads</div>
              </div>

              <div className="p-6 bg-orange-900/30 border border-orange-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Mail className="text-orange-500" size={24} />
                  {statsLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{stats.newLeads}</div>
                <div className="text-sm text-gray-400">New Leads</div>
              </div>
            </div>

            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Quick Navigation</h3>
              <p className="text-sm text-gray-400 mb-4">
                Use the tabs above to manage services, gallery items, and leads. You can add, edit, delete, and toggle status for each item.
              </p>
              <Link href="/" className="text-sm text-[var(--cyan)] hover:underline">
                View Public Website →
              </Link>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Services</h2>
              <button
                onClick={handleAddService}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--cyan)] text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Plus size={20} />
                Add Service
              </button>
            </div>

            {servicesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[var(--cyan)]" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {service.imageUrl && (
                          <img src={service.imageUrl} alt="thumb" className="w-20 h-14 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{service.titleEn}</h3>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {service.isFavourite ? (
                              <Badge className="bg-yellow-600">Favourite</Badge>
                            ) : null}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{(service.descriptionEn || "").substring(0, 150)}...</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span>Order: {service.orderIndex}</span>
                            <span className="flex items-center gap-1">Icon: {renderIcon(service.icon, 14)}<span>{service.icon || "-"}</span></span>
                            <span className="text-orange-400 font-semibold">From {service.priceStart ?? 0} {service.currency || "MAD"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Active</span>
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => handleToggleServiceActive(service)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Favourite</span>
                          <Switch
                            checked={Boolean(service.isFavourite)}
                            onCheckedChange={() => handleToggleServiceFavourite(service)}
                          />
                        </div>
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => requestDeleteService(service.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No services yet. Click "Add Service" to create one.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Gallery</h2>
              <button
                onClick={handleAddGallery}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--magenta)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Plus size={20} />
                Add Gallery Item
              </button>
            </div>

            {galleryLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[var(--magenta)]" size={32} />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-white">{item.titleEn}</h3>
                          {item.showOnHomepage && (
                            <Badge className="bg-blue-600">On Homepage</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{(item.descriptionEn || "").substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Category: {item.category}</span>
                          <span>Order: {item.orderIndex}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Homepage</span>
                        <Switch
                          checked={item.showOnHomepage}
                          onCheckedChange={() => handleToggleGalleryShowOnHomepage(item)}
                        />
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => handleEditGallery(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => requestDeleteGallery(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-400">
                    No gallery items yet. Click "Add Gallery Item" to create one.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Leads</h2>
            </div>

            {leadsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                          <Badge
                            variant={
                              lead.status === "new"
                                ? "default"
                                : lead.status === "contacted"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {lead.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>Email: {lead.email}</p>
                          <p>Phone: {lead.phone}</p>
                          <p>Date: {new Date(lead.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleUpdateLeadStatus(lead.id, value)}
                        >
                          <SelectTrigger className="w-[130px] bg-gray-900 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => requestDeleteLead(lead.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No leads yet. They will appear here when customers submit the contact form.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contact Settings Tab */}
        {activeTab === "contact" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Contact Information Settings</h2>
              <p className="text-gray-400">Manage contact details displayed on your website</p>
            </div>

            {contactLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-green-500" size={32} />
              </div>
            ) : (
              <div className="max-w-4xl">
                {contactNotice && (
                  <div
                    className={`${
                      contactNotice.type === "success"
                        ? "bg-green-900/30 border-green-700 text-green-200"
                        : "bg-red-900/30 border-red-700 text-red-200"
                    } border rounded-lg p-3 mb-4`}
                  >
                    {contactNotice.message}
                  </div>
                )}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Mail className="inline mr-2" size={16} />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={contactSettings.email}
                        onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                        placeholder="info@artroad.ae"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Phone className="inline mr-2" size={16} />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={contactSettings.phone}
                        onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                        placeholder="+971 4 123 4567"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Mail className="inline mr-2" size={16} />
                        WhatsApp Link
                      </label>
                      <Input
                        type="text"
                        value={contactSettings.whatsapp}
                        onChange={(e) => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                        placeholder="wa.link/614i6b"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: wa.link/XXXXX or phone number (971501234567)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Image className="inline mr-2" size={16} />
                        Logo URL (.png) - Fallback
                      </label>
                      <Input
                        type="url"
                        value={contactSettings.logoUrl}
                        onChange={(e) => setContactSettings({ ...contactSettings, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Image className="inline mr-2" size={16} />
                        Logo URL (Light mode)
                      </label>
                      <Input
                        type="url"
                        value={contactSettings.logoUrlLight}
                        onChange={(e) => setContactSettings({ ...contactSettings, logoUrlLight: e.target.value })}
                        placeholder="https://example.com/logo-light.png"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        <Image className="inline mr-2" size={16} />
                        Logo URL (Dark mode)
                      </label>
                      <Input
                        type="url"
                        value={contactSettings.logoUrlDark}
                        onChange={(e) => setContactSettings({ ...contactSettings, logoUrlDark: e.target.value })}
                        placeholder="https://example.com/logo-dark.png"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      <MapPin className="inline mr-2" size={16} />
                      Physical Address
                    </label>
                    <Textarea
                      value={contactSettings.address}
                      onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                      placeholder="Dubai Design District, Dubai, UAE"
                      rows={3}
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Google Maps Location</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Google Maps URL</label>
                        <Input
                          type="url"
                          value={contactSettings.locationUrl}
                          onChange={(e) => setContactSettings({ ...contactSettings, locationUrl: e.target.value })}
                          placeholder="https://maps.app.goo.gl/iyJHt2x9jWWuajar7"
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Get URL: <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[var(--cyan)] hover:underline">Google Maps</a> → Find location → Click "Share" → Copy link
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Google Maps Embed Code (Full iframe)</label>
                        <Textarea
                          value={contactSettings.googleMapsIframeCode}
                          onChange={(e) => setContactSettings({ ...contactSettings, googleMapsIframeCode: e.target.value })}
                          placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="450" style="border:0; border-radius:12px;" allowfullscreen="" loading="lazy"></iframe>'
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">⚠️ Short URLs won't work. Go to Google Maps → Share → Embed map → Copy the entire &lt;iframe&gt; code.</p>
                        <div className="mt-3">
                          <button
                            onClick={() => setShowMapPreview((v) => !v)}
                            className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[#E05A00] text-white rounded-lg hover:scale-[1.02] transition-transform"
                          >
                            {showMapPreview ? "Hide Preview" : "Preview Map"}
                          </button>
                        </div>
                        {showMapPreview && contactSettings.googleMapsIframeCode && (
                          <div className="mt-3 rounded overflow-hidden border border-gray-700" dangerouslySetInnerHTML={{ __html: contactSettings.googleMapsIframeCode }} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Landing Page Background Image URL</h3>
                    <Input
                      type="url"
                      value={contactSettings.heroBackgroundUrl}
                      onChange={(e) => setContactSettings({ ...contactSettings, heroBackgroundUrl: e.target.value })}
                      placeholder="https://i.postimg.cc/bv97GWV4/logo-final-ART-ROAD-blanc.png"
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-2">Used for the home hero background. Paste a direct image URL (PNG/JPEG).</p>
                    {contactSettings.heroBackgroundUrl && (
                      <div className="mt-3 rounded overflow-hidden border border-gray-700">
                        <img src={contactSettings.heroBackgroundUrl} alt="Hero preview" className="w-full max-h-40 object-cover" />
                      </div>
                    )}
                  </div>

                  {(contactSettings.logoUrl || contactSettings.logoUrlLight || contactSettings.logoUrlDark) && (
                    <div className="border-t border-gray-700 pt-6 grid md:grid-cols-3 gap-6">
                      {contactSettings.logoUrl && (
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2">Logo Preview (Fallback)</h3>
                          <div className="bg-gray-900 rounded-lg p-6 inline-block border border-gray-700">
                            <img src={contactSettings.logoUrl} alt="Logo Fallback" className="max-h-20" />
                          </div>
                        </div>
                      )}
                      {contactSettings.logoUrlLight && (
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2">Logo Preview (Light mode)</h3>
                          <div className="bg-white rounded-lg p-6 inline-block border border-gray-200">
                            <img src={contactSettings.logoUrlLight} alt="Logo Light" className="max-h-20" />
                          </div>
                        </div>
                      )}
                      {contactSettings.logoUrlDark && (
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2">Logo Preview (Dark mode)</h3>
                          <div className="bg-black rounded-lg p-6 inline-block border border-gray-700">
                            <img src={contactSettings.logoUrlDark} alt="Logo Dark" className="max-h-20" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveContactSettings}
                      disabled={contactSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[#E05A00] text-white rounded-lg hover:scale-[1.02] transition-all font-medium disabled:opacity-50"
                    >
                      {contactSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Settings size={20} />
                          Save Contact Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Note</h4>
                  <p className="text-sm text-gray-300">
                    Changes will be reflected on the contact and home pages immediately after saving. Make sure to test the WhatsApp link and Google Maps location.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">About Page Management</h2>
              <p className="text-gray-400">Manage team members and about page content</p>
            </div>

            {/* Team Management */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Team Members</h3>
                <button
                  onClick={handleAddTeam}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <Plus size={20} />
                  Add Team Member
                </button>
              </div>

              {teamLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors"
                    >
                      <div className="aspect-square bg-black/30 relative">
                        {member.photoUrl && (
                          <img
                            src={member.photoUrl}
                            alt={member.nameEn}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-white mb-2 truncate">{member.nameEn}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTeam(member)}
                            className="flex-1 p-1.5 text-xs text-blue-400 hover:bg-blue-500/10 rounded"
                          >
                            <Edit size={14} className="mx-auto" />
                          </button>
                          <button
                            onClick={() => requestDeleteTeam(member.id)}
                            className="flex-1 p-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded"
                          >
                            <Trash2 size={14} className="mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No team members yet. Click "Add Team Member" to create one.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About Content Management */}
            <div className="max-w-4xl">
              {aboutNotice && (
                <div
                  className={`${
                    aboutNotice.type === "success"
                      ? "bg-green-900/30 border-green-700 text-green-200"
                      : "bg-red-900/30 border-red-700 text-red-200"
                  } border rounded-lg p-3 mb-4`}
                >
                  {aboutNotice.message}
                </div>
              )}

              {aboutLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">About Art Road</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">English</label>
                        <Textarea
                          value={aboutSettings.aboutArtRoadEn}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, aboutArtRoadEn: e.target.value })}
                          placeholder="About Art Road text in English..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">French</label>
                        <Textarea
                          value={aboutSettings.aboutArtRoadFr}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, aboutArtRoadFr: e.target.value })}
                          placeholder="About Art Road text in French..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Arabic</label>
                        <Textarea
                          value={aboutSettings.aboutArtRoadAr}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, aboutArtRoadAr: e.target.value })}
                          placeholder="About Art Road text in Arabic..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Our Story</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">English</label>
                        <Textarea
                          value={aboutSettings.ourStoryEn}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, ourStoryEn: e.target.value })}
                          placeholder="Our Story text in English..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">French</label>
                        <Textarea
                          value={aboutSettings.ourStoryFr}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, ourStoryFr: e.target.value })}
                          placeholder="Our Story text in French..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Arabic</label>
                        <Textarea
                          value={aboutSettings.ourStoryAr}
                          onChange={(e) => setAboutSettings({ ...aboutSettings, ourStoryAr: e.target.value })}
                          placeholder="Our Story text in Arabic..."
                          rows={4}
                          className="bg-gray-900 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveAboutSettings}
                      disabled={aboutSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:scale-[1.02] transition-all font-medium disabled:opacity-50"
                    >
                      {aboutSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Settings size={20} />
                          Save About Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trusted Companies Tab */}
        {activeTab === "companies" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Manage Trusted Companies</h2>
                <p className="text-gray-400 mt-1">Logos will appear in infinite marquee on Home and About pages</p>
              </div>
              <button
                onClick={handleAddCompany}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Plus size={20} />
                Add Company Logo
              </button>
            </div>

            {companiesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-yellow-500" size={32} />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center p-4">
                      {company.logoUrl && (
                        <img
                          src={company.logoUrl}
                          alt={`Company ${company.id}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Order: {company.orderIndex}</span>
                        <Badge variant={company.isActive ? "default" : "secondary"} className="text-xs">
                          {company.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-gray-400">Active</span>
                        <Switch
                          checked={company.isActive}
                          onCheckedChange={() => handleToggleCompanyActive(company)}
                        />
                      </div>
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => requestDeleteCompany(company.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {companies.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    No company logos yet. Click "Add Company Logo" to create one.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Service Dialog */}
      <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title (English)</label>
                <Input
                  value={serviceForm.titleEn}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleEn: e.target.value })}
                  placeholder="LED Panels"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Title (French)</label>
                <Input
                  value={serviceForm.titleFr}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleFr: e.target.value })}
                  placeholder="Panneaux LED"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Title (Arabic)</label>
                <Input
                  value={serviceForm.titleAr}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleAr: e.target.value })}
                  placeholder="لوحات LED"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (English)</label>
              <Textarea
                value={serviceForm.descriptionEn}
                onChange={(e) => setServiceForm({ ...serviceForm, descriptionEn: e.target.value })}
                placeholder="Description in English"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (French)</label>
              <Textarea
                value={serviceForm.descriptionFr}
                onChange={(e) => setServiceForm({ ...serviceForm, descriptionFr: e.target.value })}
                placeholder="Description en français"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (Arabic)</label>
              <Textarea
                value={serviceForm.descriptionAr}
                onChange={(e) => setServiceForm({ ...serviceForm, descriptionAr: e.target.value })}
                placeholder="الوصف بالعربية"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Image URL</label>
                <Input
                  value={serviceForm.imageUrl}
                  onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {serviceForm.imageUrl && (
                  <div className="mt-2 rounded overflow-hidden border border-gray-700">
                    <img src={serviceForm.imageUrl} className="w-full max-h-40 object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Icon (Lucide)</label>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Preview:</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-800 border border-gray-700">
                      {renderIcon(serviceForm.icon, 16)}
                    </span>
                  </div>
                </div>
                <Input
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  placeholder="e.g. lightbulb"
                  className="bg-gray-800 border-gray-700 text-white mb-2"
                />
                <Select
                  value={(serviceForm.icon || "").replace(/\s+/g, "").toLowerCase()}
                  onValueChange={(val) => setServiceForm({ ...serviceForm, icon: val })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Choose an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(({ key, label, Icon }) => (
                      <SelectItem key={key} value={key}>
                        <span className="inline-flex items-center gap-2">
                          <Icon size={16} />
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Pick from list or type a Lucide icon name (case-insensitive).</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Order Index</label>
                <Input
                  type="number"
                  value={serviceForm.orderIndex}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, orderIndex: parseInt(e.target.value) || 0 })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Starting Price</label>
                <Input
                  type="number"
                  value={serviceForm.priceStart}
                  onChange={(e) => setServiceForm({ ...serviceForm, priceStart: parseInt(e.target.value) || 0 })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Currency</label>
                <Input
                  value={serviceForm.currency}
                  onChange={(e) => setServiceForm({ ...serviceForm, currency: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={serviceForm.isActive}
                  onCheckedChange={(checked) =>
                    setServiceForm({ ...serviceForm, isActive: checked })
                  }
                />
                <label className="text-sm font-medium text-gray-300">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={serviceForm.isFavourite}
                  onCheckedChange={(checked) =>
                    setServiceForm({ ...serviceForm, isFavourite: checked })
                  }
                />
                <label className="text-sm font-medium text-gray-300">Favourite (shows on homepage)</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setServiceDialog(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveService}
              className="px-4 py-2 bg-[var(--cyan)] text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {editingService ? "Save Changes" : "Create Service"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={galleryDialog} onOpenChange={setGalleryDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingGallery ? "Edit Gallery Item" : "Add New Gallery Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title (English)</label>
                <Input
                  value={galleryForm.titleEn}
                  onChange={(e) => setGalleryForm({ ...galleryForm, titleEn: e.target.value })}
                  placeholder="Project Name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Title (French)</label>
                <Input
                  value={galleryForm.titleFr}
                  onChange={(e) => setGalleryForm({ ...galleryForm, titleFr: e.target.value })}
                  placeholder="Nom du projet"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Title (Arabic)</label>
                <Input
                  value={galleryForm.titleAr}
                  onChange={(e) => setGalleryForm({ ...galleryForm, titleAr: e.target.value })}
                  placeholder="اسم المشروع"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (English)</label>
              <Textarea
                value={galleryForm.descriptionEn}
                onChange={(e) => setGalleryForm({ ...galleryForm, descriptionEn: e.target.value })}
                placeholder="Description in English"
                rows={2}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (French)</label>
              <Textarea
                value={galleryForm.descriptionFr}
                onChange={(e) => setGalleryForm({ ...galleryForm, descriptionFr: e.target.value })}
                placeholder="Description en français"
                rows={2}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Description (Arabic)</label>
              <Textarea
                value={galleryForm.descriptionAr}
                onChange={(e) => setGalleryForm({ ...galleryForm, descriptionAr: e.target.value })}
                placeholder="الوصف بالعربية"
                rows={2}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Before Image URL</label>
                <Input
                  value={galleryForm.beforeImageUrl}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, beforeImageUrl: e.target.value })
                  }
                  placeholder="https://example.com/before.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">After Image URL</label>
                <Input
                  value={galleryForm.afterImageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, afterImageUrl: e.target.value })}
                  placeholder="https://example.com/after.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Select
                  value={galleryForm.category}
                  onValueChange={(value) => setGalleryForm({ ...galleryForm, category: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="led-panels">LED Panels</SelectItem>
                    <SelectItem value="3d-decoration">3D Decoration</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Order Index</label>
                <Input
                  type="number"
                  value={galleryForm.orderIndex}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, orderIndex: parseInt(e.target.value) || 0 })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={galleryForm.showOnHomepage}
                onCheckedChange={(checked) =>
                  setGalleryForm({ ...galleryForm, showOnHomepage: checked })
                }
              />
              <label className="text-sm font-medium text-gray-300">Show on Homepage</label>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setGalleryDialog(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveGallery}
              className="px-4 py-2 bg-[var(--magenta)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {editingGallery ? "Save Changes" : "Create Gallery Item"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Dialog */}
      <Dialog open={teamDialog} onOpenChange={setTeamDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTeam ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Name (English)</label>
                <Input
                  value={teamForm.nameEn}
                  onChange={(e) => setTeamForm({ ...teamForm, nameEn: e.target.value })}
                  placeholder="John Smith"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Name (French)</label>
                <Input
                  value={teamForm.nameFr}
                  onChange={(e) => setTeamForm({ ...teamForm, nameFr: e.target.value })}
                  placeholder="Jean Dupont"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Name (Arabic)</label>
                <Input
                  value={teamForm.nameAr}
                  onChange={(e) => setTeamForm({ ...teamForm, nameAr: e.target.value })}
                  placeholder="جون سميث"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Photo URL</label>
              <Input
                value={teamForm.photoUrl}
                onChange={(e) => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="bg-gray-800 border-gray-700 text-white"
              />
              {teamForm.photoUrl && (
                <div className="mt-2 rounded overflow-hidden border border-gray-700">
                  <img src={teamForm.photoUrl} className="w-full max-h-40 object-cover" alt="Preview" />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Order Index</label>
              <Input
                type="number"
                value={teamForm.orderIndex}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, orderIndex: parseInt(e.target.value) || 0 })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setTeamDialog(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTeam}
              className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {editingTeam ? "Save Changes" : "Create Team Member"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead View Dialog */}
      <Dialog open={leadDialog} onOpenChange={setLeadDialog}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Lead Details</DialogTitle>
          </DialogHeader>
          {viewingLead && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Name</label>
                <p className="text-white">{viewingLead.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Email</label>
                <p className="text-white">{viewingLead.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Phone</label>
                <p className="text-white">{viewingLead.phone}</p>
              </div>
              {viewingLead.serviceInterest && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Service Interest</label>
                  <p className="text-white">{viewingLead.serviceInterest}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-400">Message</label>
                <p className="text-white whitespace-pre-wrap">{viewingLead.message}</p>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <p className="text-white">{viewingLead.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Source</label>
                  <p className="text-white">{viewingLead.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Date</label>
                  <p className="text-white">{new Date(viewingLead.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setLeadDialog(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trusted Company Dialog */}
      <Dialog open={companyDialog} onOpenChange={setCompanyDialog}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCompany ? "Edit Company Logo" : "Add New Company Logo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Logo URL</label>
              <Input
                value={companyForm.logoUrl}
                onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
                placeholder="https://example.com/company-logo.png"
                className="bg-gray-800 border-gray-700 text-white"
              />
              {companyForm.logoUrl && (
                <div className="mt-3 bg-white/5 rounded-lg p-4 flex items-center justify-center">
                  <img src={companyForm.logoUrl} alt="Preview" className="max-h-20 max-w-full object-contain" />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Logo will be displayed at 40px height in grayscale, color on hover
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Order Index</label>
              <Input
                type="number"
                value={companyForm.orderIndex}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, orderIndex: parseInt(e.target.value) || 0 })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in marquee</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={companyForm.isActive}
                onCheckedChange={(checked) =>
                  setCompanyForm({ ...companyForm, isActive: checked })
                }
              />
              <label className="text-sm font-medium text-gray-300">Active (shown on website)</label>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setCompanyDialog(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCompany}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {editingCompany ? "Save Changes" : "Create Company Logo"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-300">
            Are you sure you want to delete this {confirmTarget?.type}? This action cannot be undone.
          </p>
          <DialogFooter>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
              disabled={confirmLoading}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={confirmLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {confirmLoading ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Deleting...</span>
              ) : (
                "Delete"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}