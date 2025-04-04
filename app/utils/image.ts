export const getImageSrc = (file: File | { path: string } | string): string => {
    if (file instanceof File) {
        console.log("here")
      return URL.createObjectURL(file);
    }
  
    if (typeof file === "object" && "path" in file && typeof file.path === "string") {
 
      const cleaned = file.path.startsWith("./") ? file.path.slice(1) : file.path;
      return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    }
  
    if (typeof file === "string") {
        console.log("here3")
      const cleaned = file.startsWith("./") ? file.slice(1) : file;
      return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    }
  
    return "/assets/login.jpg"; 
  };