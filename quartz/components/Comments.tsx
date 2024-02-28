import { QuartzComponentConstructor } from "./types"

export default (() => {
  function Footer() {
    return (
        <script src="https://giscus.app/client.js"
            data-repo="odd256/odd256.github.io"
            data-repo-id="R_kgDOLX95UQ"
            data-category="Announcements"
            data-category-id="DIC_kwDOLX95Uc4CdlNe"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="zh-CN"
            data-loading="lazy"
            crossorigin="anonymous"
            async>
        </script>
    )
  }

  return Footer
}) satisfies QuartzComponentConstructor