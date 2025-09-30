import { v4 as uuidv4 } from "uuid";



export function generatePurchaseId() {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
    return `DASHBUY-${datePart}${timePart}-${uuidv4().slice(0, 6).toUpperCase()}`;
  }

  