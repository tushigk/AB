import { message } from "@/utils/toast";

export function handleApiError(err: any) {
  const res = err;

  if (!res) {
    message.error("Сүлжээний алдаа. Дахин оролдоно уу.");
    return;
  }

  if (res.errors && typeof res.errors === "object") {
        message.error(String(res.errors));
  } else {
    message.error(res.message || "Алдаа гарлаа");
  }
}
