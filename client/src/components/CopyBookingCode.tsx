import {useState} from "react";

export default function CopyBookingCode({code}: {code: string}) {
  const [copiedCode, setCopiedCode] = useState("");
  const [failedCode, setFailedCode] = useState("");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setFailedCode("");
    } catch {
      setCopiedCode("");
      setFailedCode(code);
    }
  }

  return (
    <>
      <button
        type="button"
        className="booking-code-copy"
        aria-label="Copy booking code"
        onClick={copyCode}
      >
        {copiedCode === code ? "Copied!" : "Copy"}
      </button>
      <span className="booking-code-copy-status" role="status">
        {failedCode === code
          ? "Unable to copy. Please select and copy the code manually."
          : copiedCode === code
            ? "Booking code copied."
            : ""}
      </span>
    </>
  );
}
