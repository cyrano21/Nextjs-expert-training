declare const require: {
  context(
    directory: string, 
    useSubdirectories: boolean, 
    regExp: RegExp
  ): {
    keys(): string[];
    (key: string): { default: string };
  };
}
