function sendMessage(message: { setConfig: { theme: string } }) {
    const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
    if (!iframe) return;
    iframe.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
}
document.addEventListener("themechange", (e) => {
    const theme = e.detail.theme === 'light' ? 'light' : 'dark'

    sendMessage({
        setConfig: {
            theme: theme
        }
    });
})

// first-time loaded
document.addEventListener("DOMContentLoaded", () => {
    const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    const currentTheme = localStorage.getItem("theme") ?? userPref
    if (currentTheme === "light") {return} // default is light theme
  
    const theme = currentTheme === "light" ? "light" : "dark"
  
    const existingGiscusContainer = document.getElementById('giscus-container');
  
    if (existingGiscusContainer) {
      // Remove the existing Giscus instance
      existingGiscusContainer.innerHTML = '';
    }
  
    // Create a new container element for Giscus
    const newGiscusContainer = document.createElement('div');
    newGiscusContainer.id = 'giscus-container';
    document.body.appendChild(newGiscusContainer);
    
    // Create a new script element with the updated data-theme attribute
    const newScript = document.createElement('script');
    newScript.src = 'https://giscus.app/client.js';
    newScript.setAttribute('data-repo', 'odd256/odd256.github.io');
    newScript.setAttribute('data-repo-id', 'R_kgDOLX95UQ');
    newScript.setAttribute('data-category', 'Announcements');
    newScript.setAttribute('data-category-id', 'DIC_kwDOLX95Uc4CdlNe');
    newScript.setAttribute('data-mapping', 'pathname');
    newScript.setAttribute('data-strict', '0');
    newScript.setAttribute('data-reactions-enabled', '1');
    newScript.setAttribute('data-emit-metadata', '0');
    newScript.setAttribute('data-input-position', 'top');
    newScript.setAttribute('data-theme', theme);
    newScript.setAttribute('data-lang', 'zh-CN');
    newScript.setAttribute('data-loading', 'lazy');
    newScript.setAttribute('crossOrigin', 'anonymous');
    newScript.async = true;
  
    // Append the new script to the Giscus container
    newGiscusContainer.appendChild(newScript);
  })