import { useState, FormEvent } from "react";

interface FieldErrors {
  name?: string;
  phone?: string;
  places?: string;
}

interface BookingFormProps {
  remainingPlaces: number;
  isSubmitting: boolean;
  onSubmit: (data: { customerName: string; customerPhone: string; places: number }) => void;
  onCancel: () => void;
}

export default function BookingForm({
  remainingPlaces,
  isSubmitting,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [places, setPlaces] = useState<number>(1);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!customerName.trim()) {
      errors.name = "Customer name is required";
    }

    const cleanPhone = customerPhone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 6) {
      errors.phone = "A valid phone number is required";
    }

    const placesNum = Number(places);
    if (!placesNum || !Number.isInteger(placesNum) || placesNum < 1 || placesNum > 4) {
      errors.places = "Places must be a whole number between 1 and 4";
    } else if (placesNum > remainingPlaces) {
      errors.places = `Only ${remainingPlaces} places remain for this event`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      places: Number(places),
    });
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate className="booking-form">
      {/* Full Name */}
      <div className="form-group">
        <label htmlFor="customerName" className="form-label">
          Full name
        </label>
        <input
          id="customerName"
          type="text"
          className={`form-input ${fieldErrors.name ? "input-error" : ""}`}
          placeholder="e.g. Sara Ahmad"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
          }}
          disabled={isSubmitting}
        />
        {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label htmlFor="customerPhone" className="form-label">
          Phone number
        </label>
        <input
          id="customerPhone"
          type="tel"
          className={`form-input ${fieldErrors.phone ? "input-error" : ""}`}
          placeholder="e.g. 0933123456"
          value={customerPhone}
          onChange={(e) => {
            setCustomerPhone(e.target.value);
            if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
          }}
          disabled={isSubmitting}
        />
        {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
      </div>

      {/* Number of Places */}
      <div className="form-group">
        <label htmlFor="places" className="form-label">
          Number of places
        </label>
        <input
          id="places"
          type="number"
          min={1}
          max={Math.min(4, Math.max(1, remainingPlaces))}
          className={`form-input ${fieldErrors.places ? "input-error" : ""}`}
          value={places}
          onChange={(e) => {
            setPlaces(Number(e.target.value));
            if (fieldErrors.places) setFieldErrors({ ...fieldErrors, places: undefined });
          }}
          disabled={isSubmitting}
        />
        <p className="form-hint">
          Up to 4 per booking. Only {remainingPlaces} {remainingPlaces === 1 ? "place remains" : "places remain"}.
        </p>
        {fieldErrors.places && <span className="field-error-text">{fieldErrors.places}</span>}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || remainingPlaces <= 0}
        >
          {isSubmitting ? "Confirming..." : "Confirm booking"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
