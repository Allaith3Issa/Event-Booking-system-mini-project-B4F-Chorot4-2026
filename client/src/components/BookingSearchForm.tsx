import type {ChangeEvent, FormEvent} from "react";

interface BookingSearchFormProps {
  phone: string;
  code: string;
  onPhoneChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  isSearching: boolean;
}

function BookingSearchForm({
  phone,
  code,
  onPhoneChange,
  onCodeChange,
  onSubmit,
  isSearching,
}: BookingSearchFormProps) {
  function handlePhoneInput(event: ChangeEvent<HTMLInputElement>) {
    onPhoneChange(event.target.value);
  }

  function handleCodeInput(event: ChangeEvent<HTMLInputElement>) {
    onCodeChange(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label>
        Phone number
        <input
          type="tel"
          autoComplete="tel"
          placeholder="0933123456"
          value={phone}
          onChange={handlePhoneInput}
          required
        />
      </label>
      <label>
        Booking code
        <input
          type="text"
          autoComplete="off"
          placeholder="EV-2093"
          value={code}
          onChange={handleCodeInput}
          required
        />
      </label>
      <button className="primary-button" type="submit" disabled={isSearching}>
        {isSearching ? "Searching..." : "Find booking"}
      </button>
    </form>
  );
}

export default BookingSearchForm;
