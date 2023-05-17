import { ref } from "vue";
import { useLayout } from "./useLayout";
import { themeColorsType } from "../layout/types";
import useGetInstance from "@/hooks/useGetInstance";

export function useDataThemeChange() {
  const { layoutTheme, layout } = useLayout();
  const themeColors = ref<Array<themeColorsType>>([
    /* 道奇蓝（默认） */
    { color: "#1b2a47", themeColor: "default" },
    /* 亮白色 */
    { color: "#ffffff", themeColor: "light" },
    /* 猩红色 */
    { color: "#f5222d", themeColor: "dusk" },
    /* 橙红色 */
    { color: "#fa541c", themeColor: "volcano" },
    /* 金色 */
    { color: "#fadb14", themeColor: "yellow" },
    /* 绿宝石 */
    { color: "#13c2c2", themeColor: "mingQing" },
    /* 酸橙绿 */
    { color: "#52c41a", themeColor: "auroraGreen" },
    /* 深粉色 */
    { color: "#eb2f96", themeColor: "pink" },
    /* 深紫罗兰色 */
    { color: "#722ed1", themeColor: "saucePurple" }
  ]);

  const { $appConfig } = useGetInstance();
  const dataTheme = ref<boolean>($appConfig?.layout?.darkMode);
  const body = document.documentElement as HTMLElement;

  return {
    body,
    dataTheme,
    layoutTheme,
    themeColors
  };
}
