export default function formatDate(dateString, format = "DD MMM YYYY") {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const formattedDate = format
    .replace("DD", day.toString().padStart(2, "0"))
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("MMM", months[month - 1])
    .replace("YYYY", year)
    .replace("HH", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"));
  return formattedDate;
}
