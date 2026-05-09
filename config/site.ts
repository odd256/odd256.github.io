export const siteConfig = {
  title: "Yifei's Digital Garden",
  description: "Sharing knowledge and insights",
  url: "https://odd256.github.io",
  notesOrder: "desc", // "desc" 为降序, "asc" 为升序
  createdFieldName: "created", // Front-matter 中用于创建时间的字段名
  updatedFieldName: "updated", // Front-matter 中用于更新时间的字段名
  displayDateField: "updated", // 页面上主要显示的日期字段 ("created" | "updated")
  links: {
    github: "https://github.com/odd256",
    twitter: "",
    email: "xyf102499@163.com",
  },
  analytics: {
    umami: {
      websiteId: "41671e48-9c7d-4f74-ba19-a72e70ceda52", // 在此填入你的 Umami Website ID
      scriptUrl: "https://cloud.umami.is/script.js", // 如果是自托管请修改此 URL
    },
  },
};

export type SiteConfig = typeof siteConfig;
