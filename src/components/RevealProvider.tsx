"use client";

import { useEffect } from "react";

export default function RevealProvider() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        // Once revealed, stop observing
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        // Observe all elements with the 'reveal' class
        const elements = document.querySelectorAll(".reveal");
        elements.forEach((el) => observer.observe(el));

        // Also observe dynamically added elements via MutationObserver
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.classList.contains("reveal")) {
                            observer.observe(node);
                        }
                        node.querySelectorAll?.(".reveal").forEach((el) => {
                            observer.observe(el);
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return null;
}
