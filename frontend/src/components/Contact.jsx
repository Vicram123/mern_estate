import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`);
        if (!res.ok) {
          throw new Error("Failed to fetch landlord information");
        }
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
        setError("Could not load landlord information.");
      } finally {
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {loading && <p>Loading landlord information...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <a
            href={`mailto:${
              landlord.email
            }?subject=Regarding ${encodeURIComponent(
              listing.name
            )}&body=${encodeURIComponent(message)}`}
            className={`bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 ${
              !message ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={(e) => !message && e.preventDefault()} // Prevent default if message is empty
          >
            Send Message
          </a>
        </div>
      )}
    </>
  );
}

// PropTypes validation
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
