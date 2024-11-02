import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // Initialize state with current user data
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(
    currentUser.avatar || "default-avatar-url.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setAvatar(currentUser.avatar || "default-avatar-url.jpg");
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/desvmqruq/image/upload`,
      true
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        setAvatar(data.secure_url);
        setUploadProgress(0);
        setSuccessMessage("Image successfully uploaded!");
      } else {
        console.error("Upload failed:", data.error);
        setErrorMessage(
          `Upload failed: ${data.error.message || "Unknown error"}`
        );
      }
      setLoading(false);
    };

    xhr.onerror = () => {
      console.error("Error uploading image");
      setErrorMessage("Error uploading image: Please try again.");
      setLoading(false);
    };

    xhr.send(formData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Check if currentUser and its _id are defined
    if (!currentUser || !currentUser._id) {
      setErrorMessage("User not found. Please log in again.");

      setLoading(false);
      return;
    }
    console.log("Current user id ", currentUser._id);
    const updatedUser = {
      username,
      email,
      ...(password && { password }), // Include password only if provided
      avatar,
    };

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      // Check if the response is OK
      if (!res.ok) {
        const errorText = await res.text(); // Get the response text
        throw new Error(errorText || "Update failed");
      }

      const data = await res.json();

      dispatch(updateUserSuccess(data));
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error));

      // Check if there's a response and a message from the server
      const errorMessage =
        error.response?.data?.message || `Update failed: ${error.message}`;
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK
      if (!res.ok) {
        const errorText = await res.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response for debugging
        throw new Error("Failed to delete user: " + errorText); // Throw an error with response text
      }

      const data = await res.json(); // Parse JSON only if response is OK

      // Dispatch success action with user data or a success message
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message || "An error occurred"));

      // Set a more user-friendly error message
      const errorMessage = error.message || "An unexpected error occurred.";
      setErrorMessage(errorMessage);
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          id="password"
          type="password"
          placeholder="Password (optional)"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Update"}
        </button>
        {loading && <div>Upload Progress: {uploadProgress}%</div>}
        {successMessage && (
          <div className="text-green-700 mt-2">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-700 mt-2">{errorMessage}</div>
        )}
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 "
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
    </div>
  );
}
