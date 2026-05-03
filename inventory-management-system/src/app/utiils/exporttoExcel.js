import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName = "Data") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // 🔥 sanitize data
  const cleanedData = data.map((item) => {
    const newItem = {};

    Object.keys(item).forEach((key) => {
      let value = item[key];

      if (value === null || value === undefined) {
        value = "";
      }

      // Convert objects → string
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }

      // 🔥 LIMIT LENGTH (CRITICAL FIX)
      if (typeof value === "string" && value.length > 30000) {
        value = value.substring(0, 30000);
      }

      newItem[key] = value;
    });

    return newItem;
  });

  const ws = XLSX.utils.json_to_sheet(cleanedData);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, fileName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};