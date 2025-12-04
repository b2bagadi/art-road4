"use client";

import { useEffect, useRef } from "react";
import "./service-led-background.css";

export default function ServiceLedBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Create floating LED particles
        const createParticles = () => {
            const colors = [
                'var(--led-panel)',
                'var(--wall-3d)',
                'var(--signage)',
                'var(--event)',
                'var(--lighting)',
                'var(--interior)'
            ];

            // Create 20 particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'led-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.setProperty('--particle-drift', `${(Math.random() - 0.5) * 100}px`);
                particle.style.animationDuration = `${15 + Math.random() * 20}s`;
                particle.style.animationDelay = `${Math.random() * 10}s`;

                container.appendChild(particle);
            }
        };

        // Scroll parallax effect for LED bars
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const bars = container.querySelectorAll('.led-bar');

            bars.forEach((bar, index) => {
                const speed = 0.1 + (index * 0.05);
                const offset = scrollY * speed * (index % 2 === 0 ? 1 : -1);
                (bar as HTMLElement).style.transform = `translateX(${Math.min(Math.max(offset, -50), 50)}px)`;
            });
        };

        // Service card hover effect
        const handleServiceHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const card = target.closest('.service-card, [data-service-card]');

            if (card && card instanceof HTMLElement) {
                const rect = card.getBoundingClientRect();
                const colors = [
                    'var(--led-panel)',
                    'var(--wall-3d)',
                    'var(--signage)',
                    'var(--event)',
                    'var(--lighting)',
                    'var(--interior)'
                ];

                // Create beam effect
                const beam = document.createElement('div');
                beam.className = 'led-beam';
                beam.style.left = `${rect.left + rect.width / 2}px`;
                beam.style.top = `${rect.top}px`;
                beam.style.color = colors[Math.floor(Math.random() * colors.length)];

                document.body.appendChild(beam);

                // Remove after animation
                setTimeout(() => beam.remove(), 800);
            }
        };

        // Initialize
        createParticles();

        // Add event listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('mouseenter', handleServiceHover, true);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mouseenter', handleServiceHover, true);
        };
    }, []);

    return (
        <div ref={containerRef} className="led-background-container" aria-hidden="true">
            {/* Layer 1: Atmosphere */}
            <div className="led-atmosphere" />

            {/* Layer 2: LED Bars */}
            <div className="led-bar" data-service="panel" />
            <div className="led-bar" data-service="wall" />
            <div className="led-bar" data-service="signage" />
            <div className="led-bar" data-service="event" />
            <div className="led-bar" data-service="lighting" />

            {/* Layer 3: Grid */}
            <div className="led-grid" />

            {/* Particles will be added dynamically */}
        </div>
    );
}
