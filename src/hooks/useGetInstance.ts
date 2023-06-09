import { getCurrentInstance, type ComponentInternalInstance } from "vue";
export default function useGetInstance() {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  const proxy = appContext.config.globalProperties;
  return { ...proxy };
}
