/**
 * Operit Sandbox Package: 相册防误扫卫士 (media_shield)
 * 
 * 作用：为 Operit 存储目录部署 .nomedia 隔离防护，防止 .ts 类型代码文件与临时媒体被 Android 误扫进相册；
 * 同时提供一键清除 MediaStore 媒体数据库错误索引的功能。
 */

export const METADATA = {
  name: "media_shield",
  version: "1.0.0",
  description: "防止 Operit 的 TypeScript 代码(.ts)及缓存文件被 Android 相册误识别为损坏视频，提供一键目录免疫与媒体库清理。",
  author: "Lmeng486",
  tools: [
    {
      name: "enable_shield",
      description: "在 Operit 目录注入 .nomedia 免疫文件，并生成防误删中文说明，阻止系统相册扫描此目录",
      parameters: {
        type: "object",
        properties: {
          target_path: {
            type: "string",
            description: "需要防护的目标目录，默认 /sdcard/Download/Operit",
            default: "/sdcard/Download/Operit"
          }
        }
      }
    },
    {
      name: "clean_broken_video_index",
      description: "扫描并清除 Android 系统媒体库中已被误判记录的 .ts 文件索引，令相册里的破损视频图标立即消失",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "匹配需要清除的路径关键词，默认 Operit",
            default: "Operit"
          }
        }
      }
    }
  ]
};

export async function execute(toolName: string, params: Record<string, any>) {
  const targetPath = params?.target_path || "/sdcard/Download/Operit";
  const keyword = params?.keyword || "Operit";

  if (toolName === "enable_shield") {
    try {
      const nomediaPath = `${targetPath}/.nomedia`;
      const readmePath = `${targetPath}/【请勿删除】Operit系统配置与开发目录.txt`;

      // 1. 创建 .nomedia
      await Files.writeString(nomediaPath, "");
      
      // 2. 创建说明文本
      const notice = "【Operit 系统专用与插件开发数据目录】\n" +
        "说明：\n" +
        "1. 本目录为 Operit 应用的核心配置、扩展包开发（dev_package）及运行时临时文件存放区。\n" +
        "2. 目录下包含 .nomedia 文件，已针对 Android 系统相册配置了防扫描策略，以避免 .ts 代码文件被误识别为破损视频。\n" +
        "3. 请勿擅自修改、重命名或删除此文件夹及其子目录，以免导致扩展包开发或相关工具异常。\n";
      await Files.writeString(readmePath, notice);

      // 3. 广播刷新
      try {
        await Shell.exec(`am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://${nomediaPath}`);
      } catch (e) {}

      return {
        success: true,
        message: `防护已成功部署至 ${targetPath}！已注入 .nomedia 并生成中文防误删说明。`
      };
    } catch (err: any) {
      return {
        success: false,
        error: `部署失败: ${err.message || String(err)}`
      };
    }
  }

  if (toolName === "clean_broken_video_index") {
    try {
      // 查询当前媒体库条目
      const queryCmd = `content query --uri content://media/external/video/media --projection _id:_data --where "_data LIKE '%${keyword}%'"`;
      const queryRes = await Shell.exec(queryCmd);

      // 执行删除
      const delCmd = `content delete --uri content://media/external/video/media --where "_data LIKE '%${keyword}%'"`;
      await Shell.exec(delCmd);

      return {
        success: true,
        message: `媒体库清理完成！已清理匹配 "${keyword}" 的错误视频索引记录。`,
        query_before: queryRes.trim() || "未发现历史遗留索引"
      };
    } catch (err: any) {
      return {
        success: false,
        error: `清理失败: ${err.message || String(err)}`
      };
    }
  }

  return {
    success: false,
    error: `未知工具名称: ${toolName}`
  };
}
