import type { Plugin } from "vite";
import dayjs, { Dayjs } from "dayjs";
// import duration from "dayjs/plugin/duration";
import { green, bold } from "picocolors";
import { getPackageSize } from "../src/utils";
// dayjs.extend(duration);

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    async closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());
        const size = await getPackageSize(outDir);
        console.log(
          bold(
            green(
              `🎉打包完成（耗时：${dayjs(endTime.diff(startTime)).format(
                "mm分ss秒"
              )}，包体积：${size}）`
            )
          )
        );
      }
    }
  };
}
