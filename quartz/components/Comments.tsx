import commentsScript from "./scripts/comments.inline"
import { QuartzComponentConstructor, QuartzComponent, QuartzComponentProps } from "./types"

const Comments: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {

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
      data-theme="light"
      data-lang="zh-CN"
      data-loading="lazy"
      crossorigin="anonymous"
      async>
    </script>
  )
}

Comments.beforeDOMLoaded = commentsScript
export default (() => Comments) satisfies QuartzComponentConstructor