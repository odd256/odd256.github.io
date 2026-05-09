"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { CollapsibleCallout } from "@/components/CollapsibleCallout";

interface MarkdownEnhancerProps {
  children: React.ReactNode;
}

interface CalloutData {
  el: HTMLElement;
  type: string;
  title: string;
  content: string;
  isDefaultCollapsed: boolean;
}

export function MarkdownEnhancer({ children }: MarkdownEnhancerProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [altText, setAltText] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [copyButtons, setCopyButtons] = useState<{ el: HTMLElement; content: string }[]>([]);
  const [callouts, setCallouts] = useState<CalloutData[]>([]);

  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        setZoomedImage(img.src);
        setAltText(img.alt || "");
        mouseEvent.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleImageClick);
      
      // 处理代码块复制按钮
      const pres = container.querySelectorAll("pre");
      const newButtons: { el: HTMLElement; content: string }[] = [];
      
      pres.forEach((pre) => {
        // 防止重复添加
        if (pre.querySelector(".copy-button-container")) return;
        
        const code = pre.querySelector("code");
        const content = code ? code.innerText : pre.innerText;
        
        const btnContainer = document.createElement("div");
        btnContainer.className = "copy-button-container";
        pre.style.position = "relative"; // 确保 pre 是相对定位的
        pre.appendChild(btnContainer);
        
        newButtons.push({ el: btnContainer, content });
      });
      
      if (newButtons.length > 0) {
        requestAnimationFrame(() => setCopyButtons(newButtons));
      }

      // 处理可折叠 Callouts
      const calloutEls = container.querySelectorAll("details.callout.collapsible");
      const newCallouts: CalloutData[] = [];
      
      calloutEls.forEach((el) => {
        // 防止重复处理
        if (el.classList.contains("animated-processed")) return;
        el.classList.add("animated-processed");

        const type = el.getAttribute("data-callout") || "note";
        const titleInner = el.querySelector(".callout-title-inner");
        const contentInner = el.querySelector(".callout-content");
        
        if (!titleInner || !contentInner) return;

        const title = titleInner.innerHTML;
        const content = contentInner.innerHTML;
        const isDefaultCollapsed = !el.hasAttribute("open");
        
        // 创建占位符
        const placeholder = document.createElement("div");
        placeholder.className = "callout-animate-placeholder";
        el.parentNode?.insertBefore(placeholder, el);
        
        // 隐藏原始元素
        (el as HTMLElement).style.display = "none";
        
        newCallouts.push({ el: placeholder, type, title, content, isDefaultCollapsed });
      });
      
      if (newCallouts.length > 0) {
        requestAnimationFrame(() => {
          setCallouts(prev => [...prev, ...newCallouts]);
        });
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleImageClick);
      }
    };
  }, [children]);

  const closeZoom = useCallback(() => {
    setZoomedImage(null);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeZoom]);

  return (
    <>
      <div ref={containerRef} className="markdown-content [&_img]:cursor-zoom-in">
        {children}
      </div>

      {/* 渲染所有代码块复制按钮 */}
      {copyButtons.map((btn, index) => 
        createPortal(
          <CopyButton 
            key={`copy-${index}`} 
            content={btn.content} 
            variant="ghost" 
            size="sm" 
            className="text-white/50 hover:text-white hover:bg-white/10"
          />, 
          btn.el
        )
      )}

      {/* 渲染所有动画 callouts */}
      {callouts.map((c, index) => 
        createPortal(
          <CollapsibleCallout 
            key={`callout-${index}`}
            type={c.type}
            title={c.title}
            content={c.content}
            isDefaultCollapsed={c.isDefaultCollapsed}
          />, 
          c.el
        )
      )}

      {/* 图片放大预览 */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeZoom}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md cursor-zoom-out p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage}
                alt={altText}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              {altText && (
                <p className="text-center mt-4 text-muted-foreground text-sm font-medium">
                  {altText}
                </p>
              )}
              <button
                onClick={closeZoom}
                className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-full backdrop-blur-sm"
                aria-label="关闭预览"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
