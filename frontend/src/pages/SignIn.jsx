import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice"; // Import actions from the user slice
import Oauth from "../components/Oauth";

export default function SignIn() {
  // Local state to hold form data
  const [formData, setFormData] = useState({});

  // Get loading and error state from the Redux store
  const { loading, error } = useSelector((state) => state.user);

  // Hooks for navigation and dispatching actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      dispatch(signInStart()); // Dispatch action to indicate sign-in process has started
      // Make a POST request to the sign-in API
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await res.json(); // Parse the response
      console.log(data);
      if (data.success === false) {
        // If sign-in fails, dispatch failure action with the error message
        dispatch(signInFailure(data.message));
        return;
      }

      // If sign-in is successful, dispatch success action with user data
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      // Dispatch failure action if an error occurs during the fetch
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <div className="text-3xl text-center font-semibold my-7">Sign In</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            id="email" // ID for the email input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            onChange={handleChange} // Update form data on change
          />
          <input
            id="password" // ID for the password input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            onChange={handleChange} // Update form data on change
          />
          <button
            disabled={loading} // Disable button while loading
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <Oauth />
        </form>
        <div className="flex gap-2 mt-5 ">
          <p>Dont have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </>
  );
}
