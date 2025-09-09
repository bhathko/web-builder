import {
  apply,
  FileEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  strings,
  template,
  url,
} from "@angular-devkit/schematics";

export function createPage(
  options: any,
  pageName: string,
  pageContent: string
): Rule {
  return mergeWith(
    apply(url("./files/page"), [
      template({
        ...options,
        ...strings,
        pageName,
        pageContent,
      }),
      forEach((file: FileEntry) => {
        if (file.path.endsWith(".template")) {
          const newPath = file.path.replace(".template", "");
          return {
            path: newPath,
            content: file.content,
          } as FileEntry;
        }

        return file;
      }),

      move(`./src/app/pages/${pageName}`),
    ])
  );
}
