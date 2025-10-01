const formatDate = (dateString, format = "DD MM YYYY") => {
  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  return format
    .replace("DD", day.toString().padStart(2, "0"))
    .replace("MMM", months[month - 1]) // <- letakkan ini sebelum "MM"
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("YYYY", year)
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"));
};

const formatToDatetimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const options = { timeZone: "Asia/Jakarta" };
  const localDate = new Date(date.toLocaleString("en-US", options));

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ⬇️ Gunakan named export
export { formatDate, formatToDatetimeLocal };
